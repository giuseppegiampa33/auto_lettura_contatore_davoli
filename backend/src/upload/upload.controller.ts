import { Controller, Get, Param, Res, StreamableFile, NotFoundException } from '@nestjs/common';
import { Response } from 'express';
import { UploadService } from './upload.service';
import { Readable } from 'stream';

@Controller('uploads')
export class UploadController {
    constructor(private readonly uploadService: UploadService) { }

    @Get(':filename')
    async getFile(@Param('filename') filename: string, @Res({ passthrough: true }) res: Response) {
        try {
            const data = await this.uploadService.getFile(filename);

            res.set({
                'Content-Type': data.ContentType,
                'Content-Length': data.ContentLength,
                'Cache-Control': 'public, max-age=31536000',
            });

            // The Body object from S3 is a stream in the Node environment
            return new StreamableFile(data.Body as Readable);
        } catch (error) {
            throw new NotFoundException('File not found');
        }
    }
}
