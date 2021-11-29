import { IsString, IsNotEmpty } from 'class-validator';
import { Expose } from 'class-transformer';

export class UserInfoRequestDTO {
  @IsString()
  @IsNotEmpty()
  @Expose({ name: 'x-user-name' })
  username: string;
}
