import Note from '../models/note.model';
import { INote } from '../interfaces/note.interface';

class NoteService {
  // Service to create a new note
  public createNote = async (body: INote, userId: string): Promise<INote> => {
    const noteData = {
      ...body,
      createdBy: userId
    };
    const note = await Note.create(noteData);
    return note;
  };

  // Service to get all notes for a user
  public getAllNotes = async (userId: string): Promise<INote[]> => {
    const notes = await Note.find({ createdBy: userId });
    return notes;
  };

  // Service to get a note by its ID
  public getNoteById = async (noteId: string, userId: string): Promise<INote | null> => {
  const note = await Note.findOne({ _id: noteId, createdBy: userId });
  return note;
  };

  // Service to update a note
   public updateNote = async (noteId: string, body: INote, userId: string): Promise<INote | null> => {
   const note = await Note.findOneAndUpdate({ _id: noteId, createdBy: userId }, body, { new: true });
   return note;
  };


  // Service to toggle archive/unarchive
  public toggleArchiveNote = async (noteId: string, userId: string): Promise<INote | null> => {
  const note = await Note.findOne({ _id: noteId, createdBy: userId });
  
  if (!note) {
    throw new Error('Note not found');
  }

  note.isArchive = !note.isArchive;
  await note.save();

  return note;
};

 // Service to toggle trash/restore
  public toggleTrashNote = async (noteId: string, userId: string): Promise<INote | null> => {
  const note = await Note.findOne({ _id: noteId, createdBy: userId });
  
  if (!note) {
    throw new Error('Note not found');
  }

  // Prevent moving to trash if the note is archived
  if (note.isArchive) {
    throw new Error('Note is archived and cannot be trashed. Unarchive it first.');
  }

  note.isTrash = !note.isTrash;
  await note.save();

  return note;
};

  // Service to delete a note permanently
  public deleteNoteForever = async (noteId: string, userId: string): Promise<INote | null> => {
    // Check if the note exists and is in trash
    const note = await Note.findOne({ _id: noteId, createdBy: userId, isTrash: true });

    if (!note) {
      throw new Error('Note not found or it is not in trash. Cannot delete forever.');
    }

    // Delete the note permanently
    await Note.deleteOne({ _id: noteId, createdBy: userId });
    return note; // Optionally return the deleted note information
  };

}

export default NoteService;
