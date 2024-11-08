import mongoose,{ Schema, model } from 'mongoose';
import { INote } from '../interfaces/note.interface';

const noteSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    color: {
      type: String,
    },
    isArchive: {
      type: Boolean,
      default: false,
    },
    isTrash: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId, // Ensure this matches the type of your User model
      required: true,
      ref: 'User', // Reference to the User model
    },
  },
  {
    timestamps: true,
  }
);

export default model<INote>('Note', noteSchema);
