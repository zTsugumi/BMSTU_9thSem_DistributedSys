import { Test, TestingModule } from '@nestjs/testing';
import * as faker from 'faker';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import {
  PaymentResponseDTO,
  CreatePaymentRequestDTO,
  CreatePaymentResponseDTO,
} from './dto/payment.dto';
import { PaymentStatus } from '../../common/types/paymentStatus';

const httpMocks = require('node-mocks-http');

const randomEnumKey = (enumeration) => {
  const keys = Object.keys(enumeration).filter((k) => !(Math.abs(Number.parseInt(k)) + 1));
  const enumKey = keys[Math.floor(Math.random() * keys.length)];
  return enumKey;
};

describe('PaymentController', () => {
  let paymentController: PaymentController;
  let paymentService: PaymentService;

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
  const paymentResponseMock: PaymentResponseDTO = {
    ...createPaymentRequestMock,
  };

  const paymentServiceMock = () => ({
    getPaymentById: jest.fn().mockImplementation((uid: string) => {
      return paymentResponseMock;
    }),
    createPayment: jest.fn().mockImplementation((createPayment: CreatePaymentRequestDTO) => {
      return createPaymentResponseMock;
    }),
    cancelPaymentById: jest.fn().mockImplementation((uid: string) => {
      return;
    }),
  });

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [PaymentController],
      providers: [
        {
          provide: PaymentService,
          useFactory: paymentServiceMock,
        },
      ],
    }).compile();

    paymentService = moduleRef.get<PaymentService>(PaymentService);
    paymentController = moduleRef.get<PaymentController>(PaymentController);
  });

  // Test existence
  it('should be defined', () => {
    expect(paymentController).toBeDefined();
  });

  // GET by uid
  it('should get a payment by uid', async () => {
    const uid = createPaymentResponseMock.paymentUid;
    expect.assertions(3);

    expect(paymentService.getPaymentById).not.toHaveBeenCalled();
    const payment = await paymentController.getPaymentById(uid);
    expect(paymentService.getPaymentById).toHaveBeenCalledWith(uid);
    expect(payment).toEqual(paymentResponseMock);
  });

  it('should create a payment', async () => {
    expect.assertions(3);

    expect(paymentService.createPayment).not.toHaveBeenCalled();
    const payment = await paymentController.createPayment(createPaymentRequestMock);
    expect(paymentService.createPayment).toHaveBeenCalledWith(createPaymentRequestMock);
    expect(payment).toEqual(createPaymentResponseMock);
  });

  it('should change status of the cancel payment', async () => {
    const uid = createPaymentResponseMock.paymentUid;
    expect.assertions(2);

    expect(paymentService.cancelPaymentById).not.toHaveBeenCalled();
    await paymentController.cancelPaymentById(uid);
    expect(paymentService.cancelPaymentById).toHaveBeenCalledWith(uid);
  });
});
