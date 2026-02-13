import { Injectable, UnauthorizedException, OnModuleInit, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { AdminUser } from './admin-user.entity';
import { AuditLog } from './audit-log.entity';
import { Submission } from '../submissions/submission.entity';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class AdminService implements OnModuleInit {
    private readonly logger = new Logger(AdminService.name);

    constructor(
        @InjectRepository(AdminUser)
        private adminUserRepository: Repository<AdminUser>,
        @InjectRepository(AuditLog)
        private auditLogRepository: Repository<AuditLog>,
        @InjectRepository(Submission)
        private submissionRepository: Repository<Submission>,
        private jwtService: JwtService,
    ) { }

    async onModuleInit() {
        // Seed admin user if none exists
        const count = await this.adminUserRepository.count();
        if (count === 0) {
            const hash = await bcrypt.hash('admin', 12);
            await this.adminUserRepository.save({
                username: 'admin',
                password_hash: hash,
            });
            this.logger.warn('Seed admin user created (username: admin, password: admin). CHANGE THIS IN PRODUCTION!');
        }
    }

    private hashData(data: string): string {
        return crypto.createHash('sha256').update(data).digest('hex');
    }

    async login(username: string, password: string, ip: string): Promise<{ access_token: string }> {
        const user = await this.adminUserRepository.findOne({ where: { username } });
        if (!user) {
            throw new UnauthorizedException('Credenziali non valide.');
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            throw new UnauthorizedException('Credenziali non valide.');
        }

        // Audit log
        await this.auditLogRepository.save({
            action: 'LOGIN',
            admin_user_id: user.id,
            ip_hash: this.hashData(ip),
            details: 'Login effettuato con successo.',
        });

        const payload = { sub: user.id, username: user.username };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async getSubmissions(adminUserId: string, ip: string): Promise<Submission[]> {
        // Audit log
        await this.auditLogRepository.save({
            action: 'VIEW_SUBMISSIONS',
            admin_user_id: adminUserId,
            ip_hash: this.hashData(ip),
        });

        return this.submissionRepository.find({ order: { created_at: 'DESC' } });
    }
}
