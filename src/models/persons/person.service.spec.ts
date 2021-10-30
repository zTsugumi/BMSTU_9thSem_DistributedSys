import { Test, TestingModule } from '@nestjs/testing';
import { PersonService } from './person.service';
import { PersonRepository } from './repositories/person.repository';
import { PersonRequestDTO, PersonResponseDTO } from './dto/person.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import * as faker from 'faker';

const httpMocks = require('node-mocks-http');

describe('PersonService', () => {
  let personService;
  let personRepository;

  const requestMock = httpMocks.createRequest();
  requestMock.personRequest = new PersonRequestDTO();
  requestMock.personRequest.name = faker.name.firstName();
  requestMock.personRequest.age = faker.datatype.number(70);
  requestMock.personRequest.address = faker.address.city();
  requestMock.personRequest.work = faker.name.jobTitle();

  const personRequestMock: PersonRequestDTO = requestMock.personRequest;
  const personResponseMock: PersonResponseDTO = {
    id: faker.datatype.number(),
    ...personRequestMock,
  };
  const personsResponseMock: PersonResponseDTO[] = [
    personResponseMock,
    { ...personResponseMock, name: faker.name.firstName() },
    { ...personResponseMock, name: faker.name.firstName() },
  ];

  const personRepositoryMock = () => ({
    createPerson: jest.fn(),
    editPerson: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  });

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        PersonService,
        {
          provide: PersonRepository,
          useFactory: personRepositoryMock,
        },
      ],
    }).compile();

    personService = moduleRef.get<PersonService>(PersonService);
    personRepository = moduleRef.get<PersonRepository>(PersonRepository);
  });

  // Test existence
  it('should be defined', () => {
    expect(personService).toBeDefined();
  });

  // GET /
  describe('getPerson', () => {
    it('should get all persons', async () => {
      personRepository.find.mockResolvedValue(personsResponseMock);

      expect(personRepository.find).not.toHaveBeenCalled();
      const persons = await personService.getPersons();
      expect(personRepository.find).toHaveBeenCalled();
      expect(persons).toEqual(personsResponseMock);
    });
  });

  // GET /:id
  describe('getPerson', () => {
    it('should throw error for invalid id', async () => {
      const id = faker.datatype.number();
      personRepository.findOne.mockResolvedValue(null);

      expect.assertions(4);

      expect(personRepository.findOne).not.toHaveBeenCalled();
      try {
        await personService.getPerson(id);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toBe(`Person ${id} not found`);
      }
      expect(personRepository.findOne).toHaveBeenCalledWith(id);
    });

    it('should return a person by id', async () => {
      const id = personResponseMock.id;
      personRepository.findOne.mockResolvedValue(personResponseMock);

      expect.assertions(3);

      expect(personRepository.findOne).not.toHaveBeenCalled();
      const person = await personService.getPerson(id);
      expect(personRepository.findOne).toHaveBeenCalledWith(id);
      expect(person).toEqual(personResponseMock);
    });
  });

  // POST /:id
  describe('createPerson', () => {
    it('should throw error for invalid data', async () => {
      const invalidPersonRequestMock = {
        ...personRequestMock,
        name: null,
      };

      personRepository.createPerson.mockResolvedValue(null);

      expect.assertions(3);

      try {
        await personService.createPerson(invalidPersonRequestMock);
      } catch (e) {
        expect(e).toBeInstanceOf(BadRequestException);
        expect(e.message).toBe('Person not created');
      }
      expect(personRepository.createPerson).toHaveBeenCalledWith(invalidPersonRequestMock);
    });

    it('should return id of created person', async () => {
      personRepository.createPerson.mockResolvedValue(personResponseMock);

      expect.assertions(3);

      expect(personRepository.createPerson).not.toHaveBeenCalled();
      const id = await personService.createPerson(personRequestMock);
      expect(personRepository.createPerson).toHaveBeenCalledWith(personRequestMock);
      expect(id).toEqual(personResponseMock.id);
    });
  });

  // PATCH /:id
  describe('editPerson', () => {
    it('should throw error for invalid id', async () => {
      const id = faker.datatype.number();
      personRepository.findOne.mockResolvedValue(null);

      expect.assertions(5);

      expect(personRepository.findOne).not.toHaveBeenCalled();
      try {
        await personService.editPerson(id, personRequestMock);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toBe(`Person ${id} not found`);
      }
      expect(personRepository.findOne).toHaveBeenCalledWith(id);
      expect(personRepository.editPerson).not.toHaveBeenCalled();
    });

    it('should return an edited person', async () => {
      const id = faker.datatype.number();
      personRepository.findOne.mockResolvedValue(personResponseMock);
      personRepository.editPerson.mockResolvedValue(personResponseMock);

      expect.assertions(4);

      expect(personRepository.findOne).not.toHaveBeenCalled();
      const person = await personService.editPerson(id, personRequestMock);
      expect(personRepository.findOne).toHaveBeenCalledWith(id);
      expect(personRepository.editPerson).toHaveBeenCalledWith(
        personResponseMock,
        personRequestMock,
      );
      expect(person).toEqual(personResponseMock);
    });
  });

  // DELETE /:id
  describe('deletePerson', () => {
    it('should delete a person', async () => {
      const id = faker.datatype.number();

      await personService.deletePerson(id);
      expect(personRepository.delete).toHaveBeenCalledWith(id);
    });
  });
});
