import { Controller, Get } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Headers } from '../../decorator/request-header.decorator';
import { UserInfoRequestDTO, UserInfoResponseDTO } from '../../dto/userinfo.dto';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/me')
  public getMe(
    @Headers(UserInfoRequestDTO) userInfo: UserInfoRequestDTO,
  ): Observable<UserInfoResponseDTO> {
    return this.userService.getMe(userInfo);
  }
}
