import { UserDTO } from '../modules/auth/dto/user';

export default class User implements Partial<UserDTO> {
  constructor(json?: UserDTO) {
    json && Object.assign(this, json);
  }
}
