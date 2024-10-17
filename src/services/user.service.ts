import User from '../models/user.model';
import { IUser } from '../interfaces/user.interface';

class UserService {
  // Create new user
  public registerUser = async (body: IUser): Promise<IUser> => {
    // Check if user already exists
    const existingUser = await User.findOne({ email: body.email });
    if (existingUser) {
      throw new Error('User already exists'); // Logic moved here
    }

    // Create a new user
    const data = await User.create(body);
    return data;
  };
}

export default UserService;
