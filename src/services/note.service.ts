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

  // Service to move a note to trash
  public trashNote = async (noteId: string, userId: string): Promise<INote | null> => {
    // Check if the note exists and is not archived
    const note = await Note.findOne({ _id: noteId, createdBy: userId, isArchive: false });
    
    if (!note) {
      throw new Error('Note not found or it is archived. Cannot move to trash.');
    }

    // Move the note to trash
    const trashedNote = await Note.findOneAndUpdate(
      { _id: noteId, createdBy: userId },
      { isTrash: true },
      { new: true }
    );
    return trashedNote;
  };

  // Service to restore a note from trash
  public restoreNote = async (noteId: string, userId: string): Promise<INote | null> => {
    // Check if the note exists and is in trash
    const note = await Note.findOne({ _id: noteId, createdBy: userId, isTrash: true });

    if (!note) {
      throw new Error('Note not found or it is not in trash. Cannot restore.');
    }

    // Restore the note by updating the isTrash field
    const restoredNote = await Note.findOneAndUpdate(
      { _id: noteId, createdBy: userId },
      { isTrash: false },
      { new: true }
    );

    return restoredNote;
  };

  // Service to get a note by ID
  public getNoteById = async (noteId: string, userId: string): Promise<INote | null> => {
    const note = await Note.findOne({ _id: noteId, createdBy: userId });
    return note;
  };



}

export default NoteService;
