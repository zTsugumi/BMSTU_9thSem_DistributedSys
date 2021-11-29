import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as faker from 'faker';
import { LoyaltyService } from './loyalty.service';
import { LoyaltyRepository } from './repositories/loyal.repository';
import { LoyaltyStatus } from '../../common/types/loyaltyStatus';
import { LoyaltyRequestDTO, LoyaltyResponseDTO } from './dto/loyalty.dto';
import { UserInfoRequestDTO } from './dto/userinfo.dto';

const httpMocks = require('node-mocks-http');

describe('LoyaltyService', () => {
  let loyaltyService;
  let loyaltyRepository;

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

  const loyaltyMock = {
    status: requestMock.loyaltyRequest.status,
    discount: requestMock.loyaltyRequest.discount,
    reservation_count: resCount,
  };
  const userRequestMock: UserInfoRequestDTO = requestMock.userRequest;
  const loyaltyRequestMock: LoyaltyRequestDTO = requestMock.loyaltyRequest;
  const loyaltyResponseMock: LoyaltyResponseDTO = {
    ...loyaltyRequestMock,
  };

  const loyaltyRepositoryMock = () => ({
    editLoyalty: jest.fn(),
    findOne: jest.fn(),
  });

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        LoyaltyService,
        {
          provide: LoyaltyRepository,
          useFactory: loyaltyRepositoryMock,
        },
      ],
    }).compile();

    loyaltyService = moduleRef.get<LoyaltyService>(LoyaltyService);
    loyaltyRepository = moduleRef.get<LoyaltyRepository>(LoyaltyRepository);
  });

  // Test existence
  it('should be defined', () => {
    expect(loyaltyService).toBeDefined();
  });

  // GET by username
  describe('getLoyaltyByUsername', () => {
    it('should throw error for invalid username', async () => {
      loyaltyRepository.findOne.mockResolvedValue(null);

      expect.assertions(4);

      expect(loyaltyRepository.findOne).not.toHaveBeenCalled();
      try {
        await loyaltyService.getLoyaltyByUsername(userRequestMock);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toBe('User not found');
      }
      expect(loyaltyRepository.findOne).toHaveBeenCalled();
    });

    it('should get a loyalty by username', async () => {
      loyaltyRepository.findOne.mockResolvedValue(loyaltyMock);

      expect.assertions(3);

      expect(loyaltyRepository.findOne).not.toHaveBeenCalled();
      const loyalty = await loyaltyService.getLoyaltyByUsername(userRequestMock);
      expect(loyaltyRepository.findOne).toHaveBeenCalled();
      expect(loyalty).toEqual(loyaltyResponseMock);
    });
  });

  describe('editLoyaltyByUsername', () => {
    it('should throw error for invalid username', async () => {
      loyaltyRepository.findOne.mockResolvedValue(null);

      expect.assertions(5);

      expect(loyaltyRepository.findOne).not.toHaveBeenCalled();
      try {
        await loyaltyService.editLoyaltyByUsername(userRequestMock, loyaltyRequestMock);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toBe('User not found');
      }
      expect(loyaltyRepository.findOne).toHaveBeenCalled();
      expect(loyaltyRepository.editLoyalty).not.toHaveBeenCalled();
    });

    it('should return an edited loyalty', async () => {
      loyaltyRepository.findOne.mockResolvedValue(loyaltyMock);
      loyaltyRepository.editLoyalty.mockResolvedValue(loyaltyMock);

      expect.assertions(4);

      expect(loyaltyRepository.findOne).not.toHaveBeenCalled();
      const loyalty = await loyaltyService.editLoyaltyByUsername(
        userRequestMock,
        loyaltyRequestMock,
      );
      expect(loyaltyRepository.findOne).toHaveBeenCalled();
      expect(loyaltyRepository.editLoyalty).toHaveBeenCalledWith(loyaltyMock, loyaltyRequestMock);
      expect(loyalty).toEqual(loyaltyResponseMock);
    });
  });

  describe('reduceLoyaltyByUsername', () => {
    it('should reduce reservation count', async () => {
      expect.assertions(2);

      expect(loyaltyRepository.findOne).not.toHaveBeenCalled();
      await loyaltyService.reduceLoyaltyByUsername(userRequestMock);
      expect(loyaltyRepository.findOne).toHaveBeenCalled();
    });
  });
});
