import User from '../models/user.model';
import { IUser } from '../interfaces/user.interface';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createChannel } from '../utils/rabbitmqClient';

class UserService {
  // Create new user
  public registerUser = async (body: IUser): Promise<IUser> => {
    // Check if user already exists
    const existingUser = await User.findOne({ email: body.email });
    if (existingUser) {
      throw new Error('User already exists'); 
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(body.password, 10);
    body.password = hashedPassword; // Store the hashed password

    // Create a new user
    const data = await User.create(body);

    // Sending message to RabbitMQ
    const message = {fname: data.firstName ,lname:data.lastName, email: data.email, };
    await this.sendMessageToQueue('user_registration_queue', message);
    return data;
  };
  // Function to send message to RabbitMQ
  private async sendMessageToQueue(queueName: string, message: any) {
    const channel = await createChannel();
    await channel.assertQueue(queueName, { durable: true });
    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
    console.log('Sent message to queue:', queueName, message);
  }

  // Log in user
  public loginUser = async (body: { email: string; password: string }): Promise<{ token: string; user: IUser }> => {
    const { email, password } = body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      console.log("hello")      
      throw new Error('Invalid email or password');
    }

    // Comparing the provided password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid email or password');
    }

    // Generate JWT
    const token = jwt.sign({user:{ _id: user._id,email: user.email}}, process.env.JWT_SECRET);

    return { token, user }; 
  };

  // Forget password service
  public forgetPassword = async (email: string): Promise<string> => {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('User not found');
    }

    const token = jwt.sign({user:{ _id: user._id }}, process.env.JWT_SECRET1);

    return token;
  };

  // Reset password service
  public resetPassword = async (newPassword, userId): Promise<void> => {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('Invalid or expired token');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
  };
}

export default UserService;
