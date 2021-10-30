import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Req,
  Res,
  Param,
  Body,
  ParseIntPipe,
  HttpCode,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { PersonRequestDTO, PersonResponseDTO } from './dto/person.dto';
import { PersonService } from './person.service';

@ApiTags('Person REST API operations')
@Controller('persons')
export class PersonController {
  constructor(private personService: PersonService) {}

  @ApiResponse({ status: 200, description: 'Person List', type: PersonResponseDTO })
  @Get()
  public async getPersons() {
    return await this.personService.getPersons();
    // res.writeHead(200, { 'Content-Type': 'application/json' });
    // res.write(JSON.stringify(persons));
    // res.end();
  }

  @ApiResponse({ status: 200, description: 'Person by ID', type: PersonResponseDTO })
  @ApiResponse({ status: 400, description: 'Invalid data' })
  @ApiResponse({ status: 404, description: 'Person by ID not found' })
  @Get('/:id')
  public async getPerson(@Param('id', ParseIntPipe) id: number) {
    return await this.personService.getPerson(id);
  }

  @ApiResponse({ status: 201, description: 'Person created' })
  @ApiResponse({ status: 400, description: 'Invalid data' })
  @Post()
  public async createPerson(
    @Req() req: Request,
    @Res() res: Response,
    @Body() personRequest: PersonRequestDTO,
  ) {
    const personId = await this.personService.createPerson(personRequest);
    res.location(req.path + '/' + personId);
    res.sendStatus(201);
  }

  @ApiResponse({ status: 200, description: 'Person by ID edited' })
  @ApiResponse({ status: 400, description: 'Invalid data' })
  @ApiResponse({ status: 404, description: 'Person by ID not found' })
  @Patch('/:id')
  public async editPerson(
    @Body() personRequest: PersonRequestDTO,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return await this.personService.editPerson(id, personRequest);
  }

  @ApiResponse({ status: 204, description: 'Person by ID deleted' })
  @Delete('/:id')
  @HttpCode(204)
  public async deletePerson(@Param('id', ParseIntPipe) id: number) {
    return await this.personService.deletePerson(id);
  }
}
