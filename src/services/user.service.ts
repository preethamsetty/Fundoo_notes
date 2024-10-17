import User from '../models/user.model';
import { IUser } from '../interfaces/user.interface';

class UserService {
  
  //create new user
  public newUser = async (body: IUser): Promise<IUser> => {
    const data = await User.create(body);
    return data;
  };
}

export default UserService;
