import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';

import { AuthGuard } from 'src/auth/auth.guard';
import { AuthService } from 'src/auth/auth.service';
import { JwtPayload } from 'src/auth/jwt-payload.interface';
import { AdminService } from './admin.service';
import { LoginAdminDto } from './dto/login-admin.dto';

interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}

@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly authService: AuthService,
  ) {}

  @Post('login')
  async login(@Body() dto: LoginAdminDto) {
    const admin = await this.adminService.validateAdmin(dto);
    const token = this.authService.generateToken(admin.id, admin.email);

    return { admin, token };
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Req() req: AuthenticatedRequest) {
    return req.user;
  }
}
