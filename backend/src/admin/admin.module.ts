import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { AdminUser } from './admin-user.entity';
import { AuditLog } from './audit-log.entity';
import { Submission } from '../submissions/submission.entity';
import { JwtStrategy } from './jwt.strategy';

@Module({
    imports: [
        ConfigModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET', 'supersecretjwtkey'),
                signOptions: { expiresIn: '8h' },
            }),
            inject: [ConfigService],
        }),
        TypeOrmModule.forFeature([AdminUser, AuditLog, Submission]),
    ],
    controllers: [AdminController],
    providers: [AdminService, JwtStrategy],
})
export class AdminModule { }
