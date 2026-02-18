import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Submission } from './submission.entity';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { UploadService } from '../upload/upload.service';
import * as crypto from 'crypto';

@Injectable()
export class SubmissionsService {
    constructor(
        @InjectRepository(Submission)
        private submissionRepository: Repository<Submission>,
        private uploadService: UploadService,
    ) { }

    private hashData(data: string): string {
        return crypto.createHash('sha256').update(data).digest('hex');
    }

    async create(createSubmissionDto: CreateSubmissionDto, file: Express.Multer.File, ip: string, userAgent: string): Promise<Submission> {

        let photoUrl = '';
        if (file) {
            try {
                photoUrl = await this.uploadService.uploadFile(file);
            } catch (error) {
                throw new InternalServerErrorException('Failed to upload file');
            }
        }

        const submission = this.submissionRepository.create({
            ...createSubmissionDto,
            foto_url: photoUrl,
            ip_hash: this.hashData(ip),
            user_agent_hash: this.hashData(userAgent),
        });

        return this.submissionRepository.save(submission);
    }

    async findAll(): Promise<Submission[]> {
        return this.submissionRepository.find({ order: { created_at: 'DESC' } });
    }

    async findOne(id: string): Promise<Submission | null> {
        return this.submissionRepository.findOne({ where: { id } });
    }

    async generatePdf(id: string): Promise<Buffer> {
        const submission = await this.findOne(id);
        if (!submission) {
            throw new Error('Submission not found');
        }

        const PDFDocument = require('pdfkit');
        const doc = new PDFDocument();
        const buffers: Buffer[] = [];

        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => { });

        // Header
        doc.fontSize(20).text('Ricevuta Autolettura Idrica', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text(`Comune di Davoli`, { align: 'center' });
        doc.moveDown(2);

        // Details
        doc.fontSize(14).text(`Codice Pratica: ${submission.id}`);
        doc.moveDown();
        doc.fontSize(12).text(`Utente: ${submission.nome} ${submission.cognome}`);
        doc.text(`Codice Fiscale: ${submission.codice_fiscale}`);
        doc.text(`Email: ${submission.email}`);
        doc.text(`Telefono: ${submission.telefono}`);
        doc.moveDown();
        doc.text(`Indirizzo Fornitura: ${submission.indirizzo}`);
        doc.text(`Matricola Contatore: ${submission.matricola}`);
        doc.text(`Lettura Annuale: ${submission.lettura_annuale}`);
        doc.text(`Data Invio: ${submission.created_at.toLocaleString('it-IT')}`);
        doc.moveDown(2);

        // Footer
        doc.fontSize(10).text('Questa ricevuta è generata automaticamente.', { align: 'center', color: 'grey' });

        doc.end();

        return new Promise((resolve) => {
            doc.on('end', () => {
                const pdfData = Buffer.concat(buffers);
                resolve(pdfData);
            });
        });
    }
}
