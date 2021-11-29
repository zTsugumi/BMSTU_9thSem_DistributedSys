import { Controller, Get } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Headers } from '../../decorator/request-header.decorator';
import { UserInfoRequestDTO, UserInfoResponseDTO } from '../../dto/userinfo.dto';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/me')
  public async getMe(
    @Headers(UserInfoRequestDTO) userInfo: UserInfoRequestDTO,
  ): Promise<UserInfoResponseDTO> {
    return await this.userService.getMe(userInfo);
  }
}
