import { Test, TestingModule } from '@nestjs/testing';
import * as faker from 'faker';
import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';
import {
  ReservationResponseDTO,
  CreateReservationRequestDTO,
  CreateReservationResponseDTO,
} from './dto/reservation.dto';
import { ReservationStatus } from '../../common/types/reservationStatus';
import { UserInfoRequestDTO } from './dto/userinfo.dto';

const httpMocks = require('node-mocks-http');

const randomEnumKey = (enumeration) => {
  const keys = Object.keys(enumeration).filter((k) => !(Math.abs(Number.parseInt(k)) + 1));
  const enumKey = keys[Math.floor(Math.random() * keys.length)];
  return enumKey;
};

describe('ReservationController', () => {
  let reservationController: ReservationController;
  let reservationService: ReservationService;

  const requestMock = httpMocks.createRequest();
  requestMock.createReservationRequest = new CreateReservationRequestDTO();
  requestMock.createReservationRequest.hotelUid = faker.datatype.uuid();
  requestMock.createReservationRequest.startDate = faker.datatype.datetime();
  requestMock.createReservationRequest.endDate = faker.datatype.datetime();
  requestMock.userRequest = new UserInfoRequestDTO();
  requestMock.userRequest.username = faker.name.findName();

  const responseMock = httpMocks.createResponse();
  responseMock.createReservationResponse = new CreateReservationResponseDTO();
  responseMock.createReservationResponse.reservationUid = faker.datatype.uuid();
  responseMock.createReservationResponse.hotelUid = requestMock.createReservationRequest.hotelUid;
  responseMock.createReservationResponse.startDate = requestMock.createReservationRequest.startDate;
  responseMock.createReservationResponse.endDate = requestMock.createReservationRequest.endDate;
  responseMock.createReservationResponse.discount = 5;
  responseMock.createReservationResponse.status = randomEnumKey(ReservationStatus);
  responseMock.createReservationResponse.payment = faker.datatype.float({ min: 0 });

  const userRequestMock: UserInfoRequestDTO = requestMock.userRequest;
  const createReservationRequestMock: CreateReservationRequestDTO =
    requestMock.createReservationRequest;
  const createReservationResponseMock: CreateReservationResponseDTO =
    responseMock.createReservationResponse;
  const reservationResponseMock: ReservationResponseDTO = responseMock.createReservationResponse;

  const reservationServiceMock = () => ({
    getReservations: jest.fn().mockImplementation((userInfo: UserInfoRequestDTO) => {
      return [reservationResponseMock];
    }),
    getReservationById: jest
      .fn()
      .mockImplementation((userInfo: UserInfoRequestDTO, uid: string) => {
        return reservationResponseMock;
      }),
    createReservation: jest
      .fn()
      .mockImplementation(
        (userInfo: UserInfoRequestDTO, createReservation: CreateReservationRequestDTO) => {
          return createReservationResponseMock;
        },
      ),
    cancelReservationById: jest
      .fn()
      .mockImplementation((userInfo: UserInfoRequestDTO, uid: string) => {
        return;
      }),
  });

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [ReservationController],
      providers: [
        {
          provide: ReservationService,
          useFactory: reservationServiceMock,
        },
      ],
    }).compile();

    reservationService = moduleRef.get<ReservationService>(ReservationService);
    reservationController = moduleRef.get<ReservationController>(ReservationController);
  });

  // Test existence
  it('should be defined', () => {
    expect(reservationController).toBeDefined();
  });

  // GET
  it('should get reservations', async () => {
    expect.assertions(3);

    expect(reservationService.getReservations).not.toHaveBeenCalled();
    const reservations = await reservationController.getReservations(userRequestMock);
    expect(reservationService.getReservations).toHaveBeenCalledWith(userRequestMock);
    expect(reservations).toEqual([reservationResponseMock]);
  });

  // GET by id
  it('should get a reservation', async () => {
    const uid = createReservationResponseMock.reservationUid;
    expect.assertions(3);

    expect(reservationService.getReservationById).not.toHaveBeenCalled();
    const reservation = await reservationController.getReservationById(userRequestMock, uid);
    expect(reservationService.getReservationById).toHaveBeenCalledWith(userRequestMock, uid);
    expect(reservation).toEqual(reservationResponseMock);
  });

  // POST
  it('should create a reservation', async () => {
    expect.assertions(3);

    expect(reservationService.createReservation).not.toHaveBeenCalled();
    const reservation = await reservationController.createReservation(
      userRequestMock,
      createReservationRequestMock,
    );
    expect(reservationService.createReservation).toHaveBeenCalledWith(
      userRequestMock,
      createReservationRequestMock,
    );
    expect(reservation).toEqual(createReservationResponseMock);
  });

  // DELETE
  it('should cancel reservation', async () => {
    const uid = createReservationResponseMock.reservationUid;
    expect.assertions(2);

    expect(reservationService.cancelReservationById).not.toHaveBeenCalled();
    await reservationController.cancelReservationById(userRequestMock, uid);
    expect(reservationService.cancelReservationById).toHaveBeenCalledWith(userRequestMock, uid);
  });
});
