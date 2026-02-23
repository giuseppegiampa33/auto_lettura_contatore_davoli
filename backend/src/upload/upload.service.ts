import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UploadService {
    private readonly logger = new Logger(UploadService.name);
    private readonly uploadDir: string;
    private readonly publicUrl: string;

    constructor(private readonly configService: ConfigService) {
        this.uploadDir = this.configService.get<string>('UPLOAD_DIR', path.join(process.cwd(), 'uploads'));
        this.publicUrl = this.configService.get<string>('PUBLIC_URL', 'http://localhost:3000');

        if (!fs.existsSync(this.uploadDir)) {
            fs.mkdirSync(this.uploadDir, { recursive: true });
            this.logger.log(`Cartella uploads creata: ${this.uploadDir}`);
        }
    }

    async uploadFile(file: Express.Multer.File): Promise<string> {
        const fileExtension = file.originalname.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${fileExtension}`;
        const filePath = path.join(this.uploadDir, fileName);

        try {
            fs.writeFileSync(filePath, file.buffer);
            this.logger.log(`File salvato: ${filePath}`);
            return `${this.publicUrl}/uploads/${fileName}`;
        } catch (error) {
            this.logger.error(`Errore nel salvataggio del file: ${error.message}`);
            throw error;
        }
    }

    getFilePath(fileName: string): string {
        return path.join(this.uploadDir, fileName);
    }
}
