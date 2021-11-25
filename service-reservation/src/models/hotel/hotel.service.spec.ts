import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Hotel } from './entities/hotel.entity';
import * as faker from 'faker';
import { HotelService } from './hotel.service';
import { PaginationRequestDTO, PaginationResponseDTO } from './dto/pagination.dto';
import { HotelResponseDTO } from './dto/hotel.dto';

const httpMocks = require('node-mocks-http');

describe('HotelService', () => {
  let hotelService;
  let hotelRepository;

  const requestMock = httpMocks.createRequest();
  requestMock.paginationRequestDTO = new PaginationRequestDTO();
  requestMock.paginationRequestDTO.page = faker.datatype.number({
    min: 0,
  });
  requestMock.paginationRequestDTO.size = faker.datatype.number({
    min: 1,
    max: 100,
  });

  const hotelInfoResponse: HotelResponseDTO = {
    hotelUid: faker.datatype.uuid(),
    name: faker.company.companyName(),
    country: faker.address.country(),
    city: faker.address.city(),
    address: faker.address.streetAddress(),
    stars: faker.datatype.number({
      min: 0,
      max: 5,
    }),
    price: faker.datatype.float({
      min: 0,
    }),
  };
  const hotelResponse = {
    id: faker.datatype.number({ min: 1 }),
    hotel_uid: hotelInfoResponse.hotelUid,
    ...hotelInfoResponse,
  };
  const paginationRequestMock: PaginationRequestDTO = requestMock.paginationRequestDTO;
  const paginationResponseMock: PaginationResponseDTO = {
    page: paginationRequestMock.page,
    pageSize: paginationRequestMock.size,
    totalElements: 1,
    items: [hotelInfoResponse],
  };

  const hotelRepositoryMock = () => ({
    findAndCount: jest.fn(),
  });

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        HotelService,
        {
          provide: getRepositoryToken(Hotel),
          useFactory: hotelRepositoryMock,
        },
      ],
    }).compile();

    hotelService = moduleRef.get<HotelService>(HotelService);
    hotelRepository = moduleRef.get(getRepositoryToken(Hotel));
  });

  // Test existence
  it('should be defined', () => {
    expect(hotelService).toBeDefined();
  });

  // GET by uid
  describe('getHotels', () => {
    it('should get pagination', async () => {
      hotelRepository.findAndCount.mockResolvedValue([[hotelResponse], 1]);

      expect.assertions(3);

      expect(hotelRepository.findAndCount).not.toHaveBeenCalled();
      const hotel = await hotelService.getHotels(paginationRequestMock);
      expect(hotelRepository.findAndCount).toHaveBeenCalled();
      expect(hotel).toEqual(paginationResponseMock);
    });
  });
});
