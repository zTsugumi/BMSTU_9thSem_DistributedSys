import { Test, TestingModule } from '@nestjs/testing';
import * as faker from 'faker';
import { HotelController } from './hotel.controller';
import { HotelService } from './hotel.service';
import { PaginationRequestDTO, PaginationResponseDTO } from './dto/pagination.dto';
import { HotelResponseDTO } from './dto/hotel.dto';

const httpMocks = require('node-mocks-http');

describe('HotelController', () => {
  let hotelController: HotelController;
  let hotelService: HotelService;

  const requestMock = httpMocks.createRequest();
  requestMock.paginationRequestDTO = new PaginationRequestDTO();
  requestMock.paginationRequestDTO.page = faker.datatype.number({
    min: 0,
  });
  requestMock.paginationRequestDTO.size = faker.datatype.number({
    min: 1,
    max: 100,
  });

  const hotelResponse: HotelResponseDTO = {
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
  const paginationRequestMock: PaginationRequestDTO = requestMock.paginationRequestDTO;
  const paginationResponseMock: PaginationResponseDTO = {
    ...paginationRequestMock,
    pageSize: paginationRequestMock.size,
    totalElements: 1,
    items: [hotelResponse],
  };

  const hotelServiceMock = () => ({
    getHotels: jest.fn().mockImplementation((pagination: PaginationRequestDTO) => {
      return paginationResponseMock;
    }),
  });

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [HotelController],
      providers: [
        {
          provide: HotelService,
          useFactory: hotelServiceMock,
        },
      ],
    }).compile();

    hotelService = moduleRef.get<HotelService>(HotelService);
    hotelController = moduleRef.get<HotelController>(HotelController);
  });

  // Test existence
  it('should be defined', () => {
    expect(hotelController).toBeDefined();
  });

  // GET
  it('should get pagination', async () => {
    expect.assertions(3);

    expect(hotelService.getHotels).not.toHaveBeenCalled();
    const hotel = await hotelController.getHotels(paginationRequestMock);
    expect(hotelService.getHotels).toHaveBeenCalledWith(paginationRequestMock);
    expect(hotel).toEqual(paginationResponseMock);
  });
});
