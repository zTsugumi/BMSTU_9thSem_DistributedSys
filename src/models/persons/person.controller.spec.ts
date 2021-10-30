import { PersonController } from './person.controller';
import { PersonService } from './person.service';
import { PersonRequestDTO, PersonResponseDTO } from './dto/person.dto';
import { Test, TestingModule } from '@nestjs/testing';
import * as faker from 'faker';

const httpMocks = require('node-mocks-http');

describe('PersonController', () => {
  let personController: PersonController;
  let personService: PersonService;

  const requestMock = httpMocks.createRequest();
  const responseMock = httpMocks.createResponse();
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

  const personServiceMock = () => ({
    getPersons: jest.fn().mockImplementation(() => {
      return personsResponseMock;
    }),
    getPerson: jest.fn().mockImplementation((id: number) => {
      return personResponseMock;
    }),
    createPerson: jest.fn().mockImplementation((personRequest: PersonRequestDTO) => {
      return personResponseMock.id;
    }),
    editPerson: jest.fn().mockImplementation((id: number, personRequest: PersonRequestDTO) => {
      return personResponseMock;
    }),
    deletePerson: jest.fn(),
  });

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [PersonController],
      providers: [
        {
          provide: PersonService,
          useFactory: personServiceMock,
        },
      ],
    }).compile();

    personService = moduleRef.get<PersonService>(PersonService);
    personController = moduleRef.get<PersonController>(PersonController);
  });

  // Test existence
  it('should be defined', () => {
    expect(personController).toBeDefined();
  });

  // GET /
  it('should get all persons', async () => {
    expect.assertions(3);

    expect(personService.getPersons).not.toHaveBeenCalled();
    const persons = await personController.getPersons();
    expect(personService.getPersons).toHaveBeenCalled();
    expect(persons).toEqual(personsResponseMock);
  });

  // GET /:id
  it('should get a person by id', async () => {
    const id = personResponseMock.id;

    expect.assertions(3);

    expect(personService.getPerson).not.toHaveBeenCalled();
    const person = await personController.getPerson(id);
    expect(personService.getPerson).toHaveBeenCalledWith(id);
    expect(person).toEqual(personResponseMock);
  });

  // POST /:id
  it('should create a person', async () => {
    expect.assertions(2);

    expect(personService.createPerson).not.toHaveBeenCalled();
    await personController.createPerson(requestMock, responseMock, personRequestMock);
    expect(personService.createPerson).toHaveBeenCalledWith(personRequestMock);
  });

  // PATCH /:id
  it('should return an edited person', async () => {
    const id = faker.datatype.number();

    expect.assertions(3);

    expect(personService.editPerson).not.toHaveBeenCalled();
    const person = await personService.editPerson(id, personRequestMock);
    expect(personService.editPerson).toHaveBeenCalledWith(id, personRequestMock);
    expect(person).toEqual(personResponseMock);
  });

  // DELETE /:id
  it('should delete a person', async () => {
    const id = faker.datatype.number();

    await personService.deletePerson(id);
    expect(personService.deletePerson).toHaveBeenCalledWith(id);
  });
});
