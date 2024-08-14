import { UserDTO } from './user';

export interface LoginDTO {
  accessToken: string;
  refreshToken: string;
  user: UserDTO;
}
