import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { S3Client, PutObjectCommand, CreateBucketCommand, HeadBucketCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class UploadService implements OnModuleInit {
    private readonly s3Client: S3Client;
    private readonly logger = new Logger(UploadService.name);
    private readonly bucketName: string;

    constructor(private readonly configService: ConfigService) {
        this.bucketName = this.configService.get<string>('S3_BUCKET', 'autolettura-uploads');

        this.s3Client = new S3Client({
            region: this.configService.get<string>('S3_REGION', 'us-east-1'),
            endpoint: this.configService.get<string>('S3_ENDPOINT', 'http://localhost:9000'),
            forcePathStyle: true,
            credentials: {
                accessKeyId: this.configService.get<string>('S3_ACCESS_KEY', 'minioadmin'),
                secretAccessKey: this.configService.get<string>('S3_SECRET_KEY', 'minioadmin'),
            },
        });
    }

    async onModuleInit() {
        try {
            await this.s3Client.send(new HeadBucketCommand({ Bucket: this.bucketName }));
            this.logger.log(`Bucket ${this.bucketName} exists.`);
        } catch (error) {
            this.logger.warn(`Bucket ${this.bucketName} not found or not accessible. Error: ${error.name}`);
            try {
                this.logger.log(`Creating bucket ${this.bucketName}...`);
                await this.s3Client.send(new CreateBucketCommand({ Bucket: this.bucketName }));
                this.logger.log(`Bucket ${this.bucketName} created successfully.`);
            } catch (createError) {
                this.logger.error(`Failed to create bucket ${this.bucketName}: ${createError.message}`);
                // Don't throw here, let requests fail individually if bucket is truly broken
            }
        }
    }

    async uploadFile(file: Express.Multer.File): Promise<string> {
        const fileExtension = file.originalname.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${fileExtension}`;

        try {
            await this.s3Client.send(
                new PutObjectCommand({
                    Bucket: this.bucketName,
                    Key: fileName,
                    Body: file.buffer,
                    ContentType: file.mimetype,
                    ACL: 'public-read', // Or private if we use signed URLs
                }),
            );

            // Return the URL. Depending on MinIO/S3 setup, construction might vary.
            // We use S3_PUBLIC_URL for the browser to access files
            const publicUrl = this.configService.get<string>('S3_PUBLIC_URL', 'http://localhost:9002');
            return `${publicUrl}/${fileName}`;
        } catch (error) {
            this.logger.error(`Failed to upload file: ${error.message}`);
            throw error;
        }
    }

    async getFile(fileName: string) {
        try {
            const command = new GetObjectCommand({
                Bucket: this.bucketName,
                Key: fileName,
            });
            const response = await this.s3Client.send(command);
            return response;
        } catch (error) {
            this.logger.error(`Failed to get file: ${error.message}`);
            throw error;
        }
    }
}
