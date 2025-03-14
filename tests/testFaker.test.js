const { expect } = require("expect");
const { faker } = require('@faker-js/faker');
const request = require('supertest');
const app = require('../server');
const each = require('mocha-each');

describe('Mocha test with Expect and Faker', () => {
    // Test 1 : check a basic data
    it('Should generate a valid email', () => {
        const email = faker.internet.email();
        expect(typeof email).toBe('string');
        expect(email).toMatch(/@/);
    });

    // Test 2 : check a fake user
    it('Should create user with correct data', () => {
        const user = {
            name: faker.person.fullName(),
            email: faker.internet.email(),
            age: faker.number.int({ min: 18, max: 99 })
        };

        expect(typeof user.name).toBe('string');
        expect(user.email).toMatch(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/);
        expect(user.age).toBeGreaterThanOrEqual(18);
        expect(user.age).toBeLessThanOrEqual(99);
    });

    // Test 3 : Check a data list
    it('Should generate a list of products', () => {
        const products = Array(3).fill().map(() => ({
            name: faker.commerce.productName(),
            price: faker.commerce.price()
        }));

        expect(products.length).toBe(3);
        expect(products[0]).toHaveProperty('name');
        expect(products[0]).toHaveProperty('price');
        expect(typeof parseFloat(products[0].price)).toBe('number');
    });
});

describe('Functionals tests', () => {
    it('should add, update, get and delete a note', async () => {
        const fakeTitle = faker.lorem.words(3);
        const fakeContent = faker.lorem.sentence();

        let res = await request(app)
            .post('/notes')
            .send({ title: fakeTitle, content: fakeContent });
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('id');
        const createdNoteId = res.body.id;

        res = await request(app).get(`/notes/${createdNoteId}`);
        expect(res.status).toBe(200);
        expect(res.body.id).toBe(createdNoteId);
        expect(res.body.title).toBe(fakeTitle);

        const updatedTitle = faker.lorem.words(3);
        const updatedContent = faker.lorem.sentence();

        res = await request(app)
            .put(`/notes/${createdNoteId}`)
            .send({ title: updatedTitle, content: updatedContent });
        expect(res.status).toBe(200);
        expect(res.body.title).toBe(updatedTitle);

        res = await request(app).delete(`/notes/${createdNoteId}`);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('deletedNote');
        expect(res.body.deletedNote.id).toBe(createdNoteId);

        res = await request(app).get(`/notes/${createdNoteId}`);
        expect(res.status).toBe(404);
    });
});

describe('Error functionals tests', () => {
    each([
        ['should return 400 if title is missing', { content: faker.lorem.sentence() }],
        ['should return 400 if content is missing', { title: faker.lorem.words(3) }],
        ['should return 400 if title is missing', { content: faker.lorem.sentence() }],
        ['should return 400 if content is missing', { title: faker.lorem.words(3) }]
    ]).it('POST /notes %s', async (description, body) => {
        const res = await request(app).post('/notes').send(body);
        expect(res.status).toBe(400);
        expect(res.body.error).toBe("Title and content are required");
    });

    each([
        ['should return 404 when note does not exist', faker.number.int({ min: 1000, max: 9999 })],
        ['should return 404 when id is not a number', faker.lorem.word()]
    ]).it('GET /notes/:id %s', async (description, id) => {
        const res = await request(app).get(`/notes/${id}`);
        expect(res.status).toBe(404);
        expect(res.body.error).toBe("Note not found");
    });

    each([
        ['should return 404 when note does not exist', faker.number.int({ min: 1000, max: 9999 }), { title: faker.lorem.words(3), content: faker.lorem.sentence() }],
        ['should return 404 when id is not a number', faker.lorem.word(), { title: faker.lorem.words(3), content: faker.lorem.sentence() }]
    ]).it('PUT /notes/:id %s', async (description, id, body) => {
        const res = await request(app).put(`/notes/${id}`).send(body);
        expect(res.status).toBe(404);
        expect(res.body.error).toBe("Note not found");
    });

    each([
        ['should return 404 when note does not exist', faker.number.int({ min: 1000, max: 9999 })],
        ['should return 404 when id is not a number', faker.lorem.word()]
    ]).it('DELETE /notes/:id %s', async (description, id) => {
        const res = await request(app).delete(`/notes/${id}`);
        expect(res.status).toBe(404);
        expect(res.body.error).toBe("Note not found");
    });
});