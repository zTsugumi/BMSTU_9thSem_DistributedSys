import { Module } from '@nestjs/common';
import { AppConfigModule } from './config/app/config.module';
import { PostgresDatabaseModule } from './database/postgres/postgres.module';
import { PersonModule } from './models/persons/person.module';

@Module({
  imports: [AppConfigModule, PostgresDatabaseModule, PersonModule],
})
export class AppModule {}
