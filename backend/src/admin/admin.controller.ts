import { Controller, Post, Body, Get, UseGuards, Ip, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AdminService } from './admin.service';

class LoginDto {
    username: string;
    password: string;
}

@Controller('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    @Post('login')
    async login(@Body() loginDto: LoginDto, @Ip() ip: string) {
        return this.adminService.login(loginDto.username, loginDto.password, ip);
    }

    @Get('submissions')
    @UseGuards(AuthGuard('jwt'))
    async getSubmissions(@Request() req: any, @Ip() ip: string) {
        return this.adminService.getSubmissions(req.user.userId, ip);
    }
}
