import { Schema, model } from 'mongoose';
import { IUser } from '../interfaces/user.interface';
import { required } from '@hapi/joi';

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required:true
    },
    lastName:{
      type: String
    },
    email:{
      type:String,
      required:true
    },
    password:{
      type:String,
      required:true
    },
    resetPasswordToken: { // Optional: Store reset token
      type: String,
      required: false,
    },
  },
  {
    timestamps: true
  }
);

export default model<IUser>('User', userSchema);
