import { User } from "../models/User.model";

export function userMapper(response: User): User {
  let user = new User('', '','','','','', []);
  if(response !== null) {
    user = new User(
      response.id,
      response.username,
      response.firstname,
      response.lastname,
      response.email,
      response.rol,
      []
    );
  }
  return user
}
