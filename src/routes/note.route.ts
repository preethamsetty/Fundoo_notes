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

    // Route to get all notes of a user
    this.router.get('/', userAuth, this.noteController.getAllNotes);

    // Route to update a note
    this.router.put('/:id', userAuth, this.noteValidator.validateNote, this.noteController.updateNote);

    // Route to archive a note
    this.router.patch('/:id/archieve', userAuth, this.noteController.archiveNote);

    // Route to trash a note
    this.router.patch('/:id/trash', userAuth, this.noteController.trashNote);
  };

  public getRoutes = (): IRouter => {
    return this.router;
  };
}

export default NoteRoutes;
