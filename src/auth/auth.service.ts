import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  generateToken(adminId: number, email: string): string {
    return this.jwtService.sign({ sub: adminId, email });
  }

  verifyToken(token: string) {
    return this.jwtService.verify(token);
  }
}
