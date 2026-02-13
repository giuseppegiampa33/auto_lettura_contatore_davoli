import { Controller, Post, Body, UseInterceptors, UploadedFile, Ip, Req, Headers, Get, UseGuards, Param, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SubmissionsService } from './submissions.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { Request, Response } from 'express';

import * as fs from 'fs';

@Controller('submissions')
export class SubmissionsController {
    constructor(private readonly submissionsService: SubmissionsService) { }

    @Post()
    @UseInterceptors(FileInterceptor('file'))
    async create(
        @Body() createSubmissionDto: CreateSubmissionDto,
        @UploadedFile() file: Express.Multer.File,
        @Ip() ip: string,
        @Headers('user-agent') userAgent: string,
    ) {
        try {
            // Basic file validation could act here or inside a pipe
            // But since we are creating a specific service, we can do it later if needed or rely on multer options
            return await this.submissionsService.create(createSubmissionDto, file, ip, userAgent || 'unknown');
        } catch (error) {
            console.error('Submission Creation Error:', error);
            try {
                fs.appendFileSync('backend_error.log', new Date().toISOString() + ' - ' + (error instanceof Error ? error.stack : JSON.stringify(error)) + '\n\n');
            } catch (e) {
                console.error('Failed to write to error log', e);
            }
            throw error;
        }
    }

    @Get(':id/pdf')
    async downloadPdf(@Param('id') id: string, @Res() res: Response) {
        try {
            const buffer = await this.submissionsService.generatePdf(id);
            res.set({
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename=ricevuta-${id}.pdf`,
                'Content-Length': buffer.length,
            });
            res.end(buffer);
        } catch (error) {
            console.error('PDF Generation Error:', error);
            res.status(404).json({ message: 'Submission not found or PDF generation failed' });
        }
    }
}
