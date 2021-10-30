import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PersonController } from './person.controller';
import { PersonService } from './person.service';
import { PersonRepository } from './repositories/person.repository';

@Module({
  imports: [TypeOrmModule.forFeature([PersonRepository])],
  controllers: [PersonController],
  providers: [PersonService],
})
export class PersonModule {}
