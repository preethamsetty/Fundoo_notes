import { expect } from 'chai';
import request from 'supertest';
import mongoose from 'mongoose';

import app from '../../src/index';

describe('User APIs Test', () => {
  before((done) => {
    const clearCollections = () => {
      for (const collection in mongoose.connection.collections) {
        mongoose.connection.collections[collection].deleteOne(() => {});
      }
    };

    const mongooseConnect = async () => {
      await mongoose.connect(process.env.DATABASE_TEST);
      clearCollections();
    };

    if (mongoose.connection.readyState === 0) {
      mongooseConnect();
    } else {
      clearCollections();
    }

    done();
  });

  const userData = {
    firstName: 'Preetham',
    lastName: 'B S',
    email: 'preethambstest@gmail.com',
    password: 'Preethambs',
  };

  const noteData = {
    title: 'Test Note',
    description: 'This is a test note.',
    color: 'blue',
    isArchive: false,
    isTrash: false,
  };

  const updatedNoteData = {
    title: 'Updated Test Note',
    description: 'This is an updated test note.',
    color: 'green',
    isArchive: true,
    isTrash: false,
  };

  let token: string; // For storing token generated during login
  let createdNoteId:string;

  describe('User Registration', () => {
    it('should register a new user successfully', async () => {
      const res = await request(app.getApp())
        .post('/api/v1/users/register')
        .send(userData);

      expect(res.status).to.equal(201);
      expect(res.body).to.have.property('message', 'User registered successfully');
    });
  });

  describe('User Login', () => {
    it('should log in an existing user successfully', async () => {
      const res = await request(app.getApp())
        .post('/api/v1/users/login')
        .send({ email: userData.email, password: userData.password });
        console.log('Login Response:', res.body);

      expect(res.status).to.equal(200);
      expect(res.body.data).to.have.property('token'); // Check for the token presence
      token = res.body.data.token;
    });
  });

  describe('Forgot Password', () => {
    it('should send a reset token to the user\'s email', async () => {
      const res = await request(app.getApp())
        .post('/api/v1/users/forget-password')
        .send({ email: userData.email });
       
      console.log(res.body);
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('message', 'Reset token sent to email successfully');
    });
  });

  describe('Create Note', () => {
    it('should create a new note successfully', async () => {
      const res = await request(app.getApp())
        .post('/api/v1/notes/create')
        .set('Authorization', `Bearer ${token}`) // Set the Authorization header with the token
        .send(noteData);
      console.log(res.body);
      expect(res.status).to.equal(201);
      expect(res.body).to.have.property('message', 'Note created successfully'); // Adjust according to your API response
      createdNoteId = res.body.data._id; // Store the created note ID for further tests
    });
  });

  describe('Get All Notes', () => {
    it('should return all notes of the user', async () => {
      const res = await request(app.getApp())
        .get('/api/v1/notes/')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(200);
      expect(res.body.data).to.be.an('array');
    });
  });

  describe('Get Note by ID', () => {
    it('should return a note by its ID', async () => {
      const noteId = createdNoteId // Get the ID of the created note

      const res = await request(app.getApp())
        .get(`/api/v1/notes/${noteId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(200);
      expect(res.body.data).to.have.property('_id', noteId);
    });
  });

  describe('Update Note', () => {
    it('should update a note successfully', async () => {
      const res = await request(app.getApp())
        .put(`/api/v1/notes/update/${createdNoteId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updatedNoteData);

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('message', 'Note updated successfully'); // Adjust according to your API response
    });
  });

  describe('Archive/Unarchive Note', () => {
    it('should archive a note successfully', async () => {
      const res = await request(app.getApp())
        .put(`/api/v1/notes/archive/${createdNoteId}`)
        .set('Authorization', `Bearer ${token}`);
      console.log(res.body);
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('message', 'Note unarchived successfully'); // Adjust according to your API response
    });
  });

  describe('Trash/Restore Note', () => {
    it('should trash a note successfully', async () => {
      const res = await request(app.getApp())
        .put(`/api/v1/notes/trash/${createdNoteId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('message', 'Note moved to trash successfully'); // Adjust according to your API response
    });
  });

  describe('Delete Note Forever', () => {
    it('should delete a note permanently', async () => {
      const res = await request(app.getApp())
        .delete(`/api/v1/notes/delete/${createdNoteId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('message', 'Note deleted permanently'); // Adjust according to your API response
    });
  });
});