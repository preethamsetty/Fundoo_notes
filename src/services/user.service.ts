import User from '../models/user.model';
import { IUser } from '../interfaces/user.interface';
import bcrypt from 'bcrypt';

class UserService {
  // Create new user
  public registerUser = async (body: IUser): Promise<IUser> => {
    // Check if user already exists
    const existingUser = await User.findOne({ email: body.email });
    if (existingUser) {
      throw new Error('User already exists'); // Logic moved here
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(body.password, 10);
    body.password = hashedPassword; // Store the hashed password

    // Create a new user
    const data = await User.create(body);
    return data;
  };

  // Log in user
  public loginUser = async (body: { email: string; password: string }): Promise<IUser> => {
    const { email, password } = body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Compare the provided password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid email or password');
    }

    return user; // Return the user object if login is successful
  };

}

export default UserService;
