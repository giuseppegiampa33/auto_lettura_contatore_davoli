import { Controller, Get, Param, Res, NotFoundException } from '@nestjs/common';
import { Response } from 'express';
import { UploadService } from './upload.service';
import * as fs from 'fs';
import * as path from 'path';
import * as mime from 'mime-types';

@Controller('uploads')
export class UploadController {
    constructor(private readonly uploadService: UploadService) { }

    @Get(':filename')
    async getFile(@Param('filename') filename: string, @Res() res: Response) {
        // Sicurezza: blocca path traversal
        const safeName = path.basename(filename);
        const filePath = this.uploadService.getFilePath(safeName);

        if (!fs.existsSync(filePath)) {
            throw new NotFoundException('File non trovato');
        }

        const contentType = mime.lookup(filePath) || 'application/octet-stream';
        res.set({
            'Content-Type': contentType,
            'Cache-Control': 'public, max-age=31536000',
        });
        res.sendFile(filePath);
    }
}
