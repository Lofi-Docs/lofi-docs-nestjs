import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello! Lofi-Docs API';
  }

  getHealth(): string {
    return `OK Lofi-Docs Server is running on port ${process.env.PORT ?? 3000}`;
  }
}
