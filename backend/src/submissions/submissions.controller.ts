import { Controller, Post, Body, UseInterceptors, UploadedFile, Ip, Req, Headers, Get, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SubmissionsService } from './submissions.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { Request } from 'express';

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
}
