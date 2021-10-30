import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Person } from './entities/person.entity';
import { PersonRequestDTO, PersonResponseDTO } from './dto/person.dto';
import { PersonRepository } from './repositories/person.repository';

@Injectable()
export class PersonService {
  constructor(
    @InjectRepository(PersonRepository)
    private personRepository: PersonRepository,
  ) {}

  public async getPersons(): Promise<PersonResponseDTO[]> {
    const persons = await this.personRepository.find();
    return persons.map((person) => this.buildPersonResponse(person));
  }

  public async getPerson(id: number): Promise<PersonResponseDTO> {
    const person = await this.personRepository.findOne(id);

    if (!person) {
      throw new NotFoundException(`Person ${id} not found`);
    }

    return this.buildPersonResponse(person);
  }

  public async createPerson(personRequest: PersonRequestDTO): Promise<number> {
    const person = await this.personRepository.createPerson(personRequest);

    if (!person) {
      throw new BadRequestException('Person not created');
    }

    return person.id;
  }

  public async editPerson(id: number, personRequest: PersonRequestDTO): Promise<PersonResponseDTO> {
    const person = await this.personRepository.findOne(id);

    if (!person) {
      throw new NotFoundException(`Person ${id} not found`);
    }

    const editedPerson = await this.personRepository.editPerson(person, personRequest);
    return this.buildPersonResponse(editedPerson);
  }

  public async deletePerson(id: number): Promise<void> {
    await this.personRepository.delete(id);
  }

  private buildPersonResponse(person: Person): PersonResponseDTO {
    const personResponseDto = new PersonResponseDTO();
    personResponseDto.id = person.id;
    personResponseDto.name = person.name;
    personResponseDto.age = person.age;
    personResponseDto.address = person.address;
    personResponseDto.work = person.work;

    return personResponseDto;
  }
}
