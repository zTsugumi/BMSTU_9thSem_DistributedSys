import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get env(): string {
    return this.configService.get<string>('app.env');
  }
  get name(): string {
    return this.configService.get<string>('app.name');
  }
  get host(): string {
    return this.configService.get<string>('app.host');
  }
  get port(): number {
    return Number(this.configService.get<number>('app.port'));
  }
}
