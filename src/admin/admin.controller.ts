import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AuthService } from '../auth/auth.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { LoginAdminDto } from './dto/login-admin.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  async register(@Body() dto: CreateAdminDto) {
    const admin = await this.adminService.register(dto);
    const token = this.authService.generateToken(admin.id, admin.email);
    return { admin, token };
  }

  @Post('login')
  async login(@Body() dto: LoginAdminDto) {
    const admin = await this.adminService.validateAdmin(dto);
    const token = this.authService.generateToken(admin.id, admin.email);
    return { admin, token };
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Req() req: any) {
    return req.user;
  }
}
