import {
  createParamDecorator,
  ExecutionContext,
  HttpException,
  HttpStatus,
  ValidationError,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

export const Headers = createParamDecorator(async (value: any, ctx: ExecutionContext) => {
  // extract headers
  const headers = ctx.switchToHttp().getRequest().headers;

  // Convert headers to DTO object
  const dto = plainToClass(value, headers, { excludeExtraneousValues: true });

  // Validate
  const errors: ValidationError[] = await validate(dto);
  if (errors.length > 0) {
    let validationErrors = errors.map((obj) => Object.values(obj.constraints));
    throw new HttpException(`Errors: ${validationErrors}`, HttpStatus.BAD_REQUEST);
  }

  // return header dto object
  return dto;
});
