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
  get httpTimeout(): number {
    return Number(this.configService.get<number>('app.httpTimeout'));
  }
  get httpMaxDirect(): number {
    return Number(this.configService.get<number>('app.httpMaxDirect'));
  }
  get urlLoyalty(): string {
    return this.configService.get<string>('app.urlLoyalty');
  }
  get urlHotels(): string {
    return this.configService.get<string>('app.urlHotels');
  }
  get urlReservations(): string {
    return this.configService.get<string>('app.urlReservations');
  }
  get urlPayments(): string {
    return this.configService.get<string>('app.urlPayments');
  }
  get urlMe(): string {
    return this.configService.get<string>('app.urlMe');
  }
}
