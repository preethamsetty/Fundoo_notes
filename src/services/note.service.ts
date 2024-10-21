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

   // Service to update a note
   public updateNote = async (noteId: string, body: INote, userId: string): Promise<INote | null> => {
    const note = await Note.findOneAndUpdate({ _id: noteId, createdBy: userId }, body, { new: true });
    return note;
  };

  // Service to archive a note
  public archiveNote = async (noteId: string, userId: string): Promise<INote | null> => {
    const note = await Note.findOneAndUpdate(
      { _id: noteId, createdBy: userId },
      { isArchive: true },
      { new: true }
    );
    console.log("Archieved note:",note)
    return note;
  };

  // Service to unarchive a note
  public unarchiveNote = async (noteId: string, userId: string): Promise<INote | null> => {
    const note = await Note.findOneAndUpdate(
      { _id: noteId, createdBy: userId },
      { isArchive: false },
      { new: true }
    );
    return note;
  };

  // Service to get a note by ID
  public getNoteById = async (noteId: string, userId: string): Promise<INote | null> => {
    const note = await Note.findOne({ _id: noteId, createdBy: userId });
    return note;
  };



}

export default NoteService;
