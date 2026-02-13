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
}
