import { Test, TestingModule } from '@nestjs/testing';
import * as faker from 'faker';
import { LoyaltyController } from './loyalty.controller';
import { LoyaltyService } from './loyalty.service';
import { LoyaltyRequestDTO, LoyaltyResponseDTO } from './dto/loyalty.dto';
import { LoyaltyStatus } from '../../common/types/loyaltyStatus';
import { UserInfoRequestDTO } from './dto/userinfo.dto';

const httpMocks = require('node-mocks-http');

describe('LoyaltyController', () => {
  let loyaltyController: LoyaltyController;
  let loyaltyService: LoyaltyService;

  const requestMock = httpMocks.createRequest();
  requestMock.loyaltyRequest = new LoyaltyRequestDTO();
  const resCount = faker.datatype.number({
    min: 0,
    max: 30,
  });
  requestMock.loyaltyRequest.reservationCount = resCount;
  requestMock.loyaltyRequest.status =
    resCount < 10
      ? LoyaltyStatus.BRONZE
      : resCount < 20
      ? LoyaltyStatus.SILVER
      : LoyaltyStatus.GOLD;
  requestMock.loyaltyRequest.discount = resCount < 10 ? 5 : resCount < 20 ? 7 : 10;

  requestMock.userRequest = new UserInfoRequestDTO();
  requestMock.userRequest.username = faker.name.findName();

  const userRequestMock: UserInfoRequestDTO = requestMock.userRequest;
  const loyaltyRequestMock: LoyaltyRequestDTO = requestMock.loyaltyRequest;
  const loyaltyResponseMock: LoyaltyResponseDTO = {
    ...loyaltyRequestMock,
  };

  const loyaltyServiceMock = () => ({
    getLoyaltyByUsername: jest.fn().mockImplementation((userInfo: UserInfoRequestDTO) => {
      return loyaltyResponseMock;
    }),
    editLoyaltyByUsername: jest
      .fn()
      .mockImplementation((userInfo: UserInfoRequestDTO, loyalInfo: LoyaltyRequestDTO) => {
        return loyaltyResponseMock;
      }),
    reduceLoyaltyByUsername: jest.fn().mockImplementation((userInfo: UserInfoRequestDTO) => {
      return;
    }),
  });

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [LoyaltyController],
      providers: [
        {
          provide: LoyaltyService,
          useFactory: loyaltyServiceMock,
        },
      ],
    }).compile();

    loyaltyService = moduleRef.get<LoyaltyService>(LoyaltyService);
    loyaltyController = moduleRef.get<LoyaltyController>(LoyaltyController);
  });

  // Test existence
  it('should be defined', () => {
    expect(loyaltyController).toBeDefined();
  });

  // GET by username
  it('should get a loyalty by username', async () => {
    expect.assertions(3);

    expect(loyaltyService.getLoyaltyByUsername).not.toHaveBeenCalled();
    const loyalty = await loyaltyController.getLoyaltyByUsername(userRequestMock);
    expect(loyaltyService.getLoyaltyByUsername).toHaveBeenCalledWith(userRequestMock);
    expect(loyalty).toEqual(loyaltyResponseMock);
  });

  it('should return an edited loyalty', async () => {
    expect.assertions(3);

    expect(loyaltyService.editLoyaltyByUsername).not.toHaveBeenCalled();
    const loyalty = await loyaltyController.editLoyaltyByUsername(
      userRequestMock,
      loyaltyRequestMock,
    );
    expect(loyaltyService.editLoyaltyByUsername).toHaveBeenCalledWith(
      userRequestMock,
      loyaltyRequestMock,
    );
    expect(loyalty).toEqual(loyaltyResponseMock);
  });

  it('should reduce reservation count', async () => {
    expect.assertions(2);

    expect(loyaltyService.reduceLoyaltyByUsername).not.toHaveBeenCalled();
    await loyaltyController.reduceLoyaltyByUsername(userRequestMock);
    expect(loyaltyService.reduceLoyaltyByUsername).toHaveBeenCalledWith(userRequestMock);
  });
});
