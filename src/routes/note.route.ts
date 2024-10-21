import express, { IRouter } from 'express';
import NoteController from '../controllers/note.controller';
import { userAuth } from '../middlewares/auth.middleware';
import NoteValidator from '../validators/note.validator';

class NoteRoutes {
  private router = express.Router();
  private noteController = new NoteController();
  private noteValidator = new NoteValidator();

  constructor() {
    this.routes();
  }

  private routes = (): void => {
    // Route to create a new note
    this.router.post('/create', userAuth, this.noteValidator.validateNote, this.noteController.createNote);

    // Route to get all Notes of a user
    this.router.get('/', userAuth, this.noteController.getAllNotes);

    // Route to update a note
    this.router.put('/:id', userAuth, this.noteValidator.validateNote, this.noteController.updateNote);

    // Route to archive a note
    this.router.put('/archive/:id', userAuth, this.noteController.archiveNote);

    // Unarchive a note
    this.router.put('/unarchive/:id', userAuth, this.noteController.unarchiveNote);

    // Route to move a note to trash
    this.router.patch('/trash/:id', userAuth, this.noteController.trashNote);

    // Route to restore a note from trash
    this.router.patch('/restore/:id', userAuth, this.noteController.restoreNote);
  };

  public getRoutes = (): IRouter => {
    return this.router;
  };
}

export default NoteRoutes;
