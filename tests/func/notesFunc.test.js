const request = require('supertest');
const { expect } = require('expect');
const app = require('../../server');

describe('Functionals tests', () => {
    it('should add, update, get and delete a note', async () => {
        let res = await request(app)
            .post('/notes')
            .send({ title: 'Note Supertest', content: 'Contenu Supertest' });
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('id');
        const createdNoteId = res.body.id;

        res = await request(app).get(`/notes/${createdNoteId}`);
        expect(res.status).toBe(200);
        expect(res.body.id).toBe(createdNoteId);
        expect(res.body.title).toBe('Note Supertest');

        res = await request(app)
            .put(`/notes/${createdNoteId}`)
            .send({ title: 'Note MAJ', content: 'Contenu MAJ' });
        expect(res.status).toBe(200);
        expect(res.body.title).toBe('Note MAJ');

        res = await request(app).delete(`/notes/${createdNoteId}`);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('deletedNote');
        expect(res.body.deletedNote.id).toBe(createdNoteId);

        res = await request(app).get(`/notes/${createdNoteId}`);
        expect(res.status).toBe(404);
    });
});

describe('Error functionals tests', () => {
    it('should return 400 for POST /notes if title is missing', async () => {
        const res = await request(app)
            .post('/notes')
            .send({ content: 'Content without title' });
        expect(res.status).toBe(400);
        expect(res.body.error).toBe("Title and content are required");
    });

    it('should return 400 for POST /notes if content is missing', async () => {
        const res = await request(app)
            .post('/notes')
            .send({ title: 'Title without content' });
        expect(res.status).toBe(400);
        expect(res.body.error).toBe("Title and content are required");
    });

    it('should return 404 for GET /notes/:id when note does not exist', async () => {
        const res = await request(app).get('/notes/9999');
        expect(res.status).toBe(404);
        expect(res.body.error).toBe("Note not found");
    });

    it('should return 404 for GET /notes/:id when id is not a number', async () => {
        const res = await request(app).get('/notes/abc');
        expect(res.status).toBe(404);
        expect(res.body.error).toBe("Note not found");
    });

    it('should return 404 for PUT /notes/:id when note does not exist', async () => {
        const res = await request(app)
            .put('/notes/9999')
            .send({ title: 'New Title', content: 'New Content' });
        expect(res.status).toBe(404);
        expect(res.body.error).toBe("Note not found");
    });

    it('should return 404 for PUT /notes/:id when note does not a number', async () => {
        const res = await request(app)
            .put('/notes/abc')
            .send({ title: 'New Title', content: 'New Content' });
        expect(res.status).toBe(404);
        expect(res.body.error).toBe("Note not found");
    });

    it('should return 404 for DELETE /notes/:id when note does not exist', async () => {
        const res = await request(app).delete('/notes/9999');
        expect(res.status).toBe(404);
        expect(res.body.error).toBe("Note not found");
    });

    it('should return 404 for DELETE /notes/:id when note does not a number', async () => {
        const res = await request(app).delete('/notes/abc');
        expect(res.status).toBe(404);
        expect(res.body.error).toBe("Note not found");
    });
});