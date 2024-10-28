import { expect } from 'chai';
import request from 'supertest';
import mongoose from 'mongoose';

import app from '../../src/index';

describe('Notes APIs Test', () => {
  let userToken: string; // Stores JWT for authenticated requests
  let createdNoteId: string; // Stores the ID of the created note

  before(async () => {
    const clearCollections = () => {
      for (const collection in mongoose.connection.collections) {
        mongoose.connection.collections[collection].deleteMany(() => {});
      }
    };

    const mongooseConnect = async () => {
      await mongoose.connect(process.env.DATABASE_TEST);
      clearCollections();
    };

    if (mongoose.connection.readyState === 0) {
      await mongooseConnect();
    } else {
      clearCollections();
    }

    const mockUser = {
      email: 'preethambstest@gmail.com',
      password: 'Preethambs',
      firstName: 'Preetham',
      lastName: 'B S',
    };

    await request(app.getApp())
      .post('/api/v1/users/register')
      .send(mockUser);

    // Log in the user to get a token
    const loginResponse = await request(app.getApp())
      .post('/api/v1/users/login')
      .send({ email: mockUser.email, password: mockUser.password });
    
    userToken = loginResponse.body.token; // Store the token for future requests
  });

  after(async () => {
    // Disconnect from the database after tests
    await mongoose.disconnect();
  });

  describe('POST /api/v1/notes/create', () => {
    it('should create a new note successfully', (done) => {
      const mockNote = {
        title: 'Sample Note',
        description: 'This is a sample note.',
      };
      request(app.getApp())
        .post('/api/v1/notes/create')
        .set('Authorization', `Bearer ${userToken}`)
        .send(mockNote)
        .end((err, res) => {
          expect(res.statusCode).to.equal(201);
          expect(res.body.message).to.equal('Note created successfully');
          expect(res.body.data).to.have.property('_id'); // Ensure an ID is returned
          createdNoteId = res.body.data._id; // Store the created note ID for further tests
          done();
        });
    });
  });

  describe('GET /api/v1/notes/', () => {
    it('should retrieve all notes for the user', (done) => {
      request(app.getApp())
        .get('/api/v1/notes/')
        .set('Authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body.data).to.be.an('array');
          done();
        });
    });
  });

  describe('GET /api/v1/notes/:id', () => {
    it('should retrieve a note by ID', (done) => {
      request(app.getApp())
        .get(`/api/v1/notes/${createdNoteId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body.data).to.have.property('_id', createdNoteId); // Ensure the correct note is returned
          done();
        });
    });
  });

  describe('PUT /api/v1/notes/update/:id', () => {
    it('should update a note successfully', (done) => {
      const updatedNote = {
        title: 'Updated Sample Note',
        description: 'This is an updated note.',
      };

      request(app.getApp())
        .put(`/api/v1/notes/update/${createdNoteId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(updatedNote)
        .end((err, res) => {
          expect(res.statusCode).to.be.equal(200);
          expect(res.body.message).to.equal('Note updated successfully');
          expect(res.body.data).to.have.property('title', updatedNote.title);
          done();
        });
    });

    it('should return an error for a non-existent note ID', (done) => {
      const nonExistentId = '60f7f2a4a2e2b32f1b6e2d50'; // Example of a non-existent ID
      const updatedNote = {
        title: 'Updated Sample Note',
        description: 'This is an updated note.',
      };
      request(app.getApp())
        .put(`/api/v1/notes/update/${nonExistentId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(updatedNote)
        .end((err, res) => {
          expect(res.statusCode).to.be.equal(400);
          expect(res.body.message).to.include('Note not found');
          done();
        });
    });
  });

  describe('PUT /api/v1/notes/archive/:id', () => {
    it('should archive a note successfully', (done) => {
      request(app.getApp())
        .put(`/api/v1/notes/archive/${createdNoteId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body.message).to.equal('Note moved to the Archive successfully'); // Adjusted message
          done();
        });
    });

    it('should return an error for a non-existent note ID', (done) => {
      const nonExistentId = '60f7f2a4a2e2b32f1b6e2d50'; // Example of a non-existent ID
      request(app.getApp())
        .put(`/api/v1/notes/archive/${nonExistentId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          expect(res.statusCode).to.be.equal(400);
          expect(res.body.message).to.include('Note not found');
          done();
        });
    });
  });

  describe('PUT /api/v1/notes/trash/:id', () => {
    it('should trash a note successfully', (done) => {
      request(app.getApp())
        .put(`/api/v1/notes/trash/${createdNoteId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body.message).to.equal('Note moved to the Trash successfully'); // Adjusted message
          done();
        });
    });
  });

  describe('DELETE /api/v1/notes/delete/:id', () => {
    it('should permanently delete a note successfully', (done) => {
      request(app.getApp())
        .delete(`/api/v1/notes/delete/${createdNoteId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          expect(res.statusCode).to.be.equal(200);
          expect(res.body.message).to.equal('Deleted successfully');
          done();
        });
    });

    it('should return an error for a non-existent note ID', (done) => {
      const nonExistentId = '60f7f2a4a2e2b32f1b6e2d50'; // Example of a non-existent ID
      request(app.getApp())
        .delete(`/api/v1/notes/delete/${nonExistentId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          expect(res.statusCode).to.be.equal(400);
          expect(res.body.message).to.include('Note not found');
          done();
        });
    });
  });
});
