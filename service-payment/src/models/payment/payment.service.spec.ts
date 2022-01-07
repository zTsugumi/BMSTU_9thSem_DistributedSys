import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as faker from 'faker';
import { PaymentService } from './payment.service';
import { PaymentRepository } from './repositories/payment.repository';
import { PaymentStatus } from '../../common/types/paymentStatus';
import {
  PaymentResponseDTO,
  CreatePaymentRequestDTO,
  CreatePaymentResponseDTO,
} from './dto/payment.dto';

const httpMocks = require('node-mocks-http');

const randomEnumKey = (enumeration) => {
  const keys = Object.keys(enumeration).filter((k) => !(Math.abs(Number.parseInt(k)) + 1));
  const enumKey = keys[Math.floor(Math.random() * keys.length)];
  return enumKey;
};

describe('PaymentService', () => {
  let paymentService;
  let paymentRepository;

  const requestMock = httpMocks.createRequest();
  requestMock.createPaymentRequest = new CreatePaymentRequestDTO();
  requestMock.createPaymentRequest.price = faker.datatype.float({
    min: 0,
  });
  requestMock.createPaymentRequest.status = randomEnumKey(PaymentStatus);

  const createPaymentRequestMock: CreatePaymentRequestDTO = requestMock.createPaymentRequest;
  const createPaymentResponseMock: CreatePaymentResponseDTO = {
    paymentUid: faker.datatype.uuid(),
    ...createPaymentRequestMock,
  };
  const paymentMock = {
    ...createPaymentResponseMock,
    payment_uid: createPaymentResponseMock.paymentUid,
  };
  const paymentResponseMock: PaymentResponseDTO = {
    ...createPaymentRequestMock,
  };

  const paymentRepositoryMock = () => ({
    createPayment: jest.fn(),
    findOne: jest.fn(),
  });

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentService,
        {
          provide: PaymentRepository,
          useFactory: paymentRepositoryMock,
        },
      ],
    }).compile();

    paymentService = moduleRef.get<PaymentService>(PaymentService);
    paymentRepository = moduleRef.get<PaymentRepository>(PaymentRepository);
  });

  // Test existence
  it('should be defined', () => {
    expect(paymentService).toBeDefined();
  });

  // GET by uid
  describe('getPaymentById', () => {
    it('should throw error for invalid id', async () => {
      const uid = createPaymentResponseMock.paymentUid;
      paymentRepository.findOne.mockResolvedValue(null);

      expect.assertions(4);

      expect(paymentRepository.findOne).not.toHaveBeenCalled();
      try {
        await paymentService.getPaymentById(uid);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toBe('Payment not found');
      }
      expect(paymentRepository.findOne).toHaveBeenCalled();
    });

    it('should get a payment by uid', async () => {
      const uid = createPaymentResponseMock.paymentUid;
      paymentRepository.findOne.mockResolvedValue(paymentResponseMock);

      expect.assertions(3);

      expect(paymentRepository.findOne).not.toHaveBeenCalled();
      const payment = await paymentService.getPaymentById(uid);
      expect(paymentRepository.findOne).toHaveBeenCalled();
      expect(payment).toEqual(paymentResponseMock);
    });
  });

  // POST
  describe('createPayment', () => {
    it('should throw error for invalid params', async () => {
      const invalidCreatePaymentRequestMock = {
        ...createPaymentRequestMock,
        price: null,
      };

      paymentRepository.createPayment.mockResolvedValue(null);

      expect.assertions(4);

      expect(paymentRepository.createPayment).not.toHaveBeenCalled();
      try {
        await paymentService.createPayment(invalidCreatePaymentRequestMock);
      } catch (e) {
        expect(e).toBeInstanceOf(BadRequestException);
        expect(e.message).toBe('Payment not created');
      }
      expect(paymentRepository.createPayment).toHaveBeenCalled();
    });

    it('should return the created payment', async () => {
      paymentRepository.createPayment.mockResolvedValue(paymentMock);

      expect.assertions(3);

      expect(paymentRepository.createPayment).not.toHaveBeenCalled();
      const payment = await paymentService.createPayment(createPaymentRequestMock);
      expect(paymentRepository.createPayment).toHaveBeenCalledWith(createPaymentRequestMock);
      expect(payment).toEqual(createPaymentResponseMock);
    });
  });

  // DELETE
  describe('cancelPaymentById', () => {
    it('should change payment status to canceled', async () => {
      const uid = createPaymentResponseMock.paymentUid;

      expect.assertions(2);

      expect(paymentRepository.findOne).not.toHaveBeenCalled();
      await paymentService.cancelPaymentById(uid);
      expect(paymentRepository.findOne).toHaveBeenCalled();
    });
  });
});
