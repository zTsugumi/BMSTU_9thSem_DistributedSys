import { Controller, Get } from '@nestjs/common';
import { UserInfoRequestDTO, UserInfoResponseDTO } from './dto/userinfo.dto';
import { UserService } from './user.service';
import { Headers } from '../../decorator/request-header.decorator';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/me')
  public async getMe(
    @Headers(UserInfoRequestDTO) userInfo: UserInfoRequestDTO,
  ): Promise<UserInfoResponseDTO> {    
    return this.userService.getMe(userInfo);
  }
}
