const { expect } = require("expect");
const { addNote, getAllNotes, getNoteById, updateNote, deleteNote, resetNotes} = require('../../functions/notes')

beforeEach(() => {
    resetNotes();
});

describe('Notes module unit tests', () => {


    it('should add note', () => {
        const newNote = addNote('First note', 'First content');
        expect(newNote).toBeDefined();
        expect(newNote.id).toBe(1);
        expect(newNote.title).toBe('First note');
        expect(newNote.content).toBe('First content');
    });

    it('should return all notes', () => {
        addNote('Test note', 'Test content');

        const notes = getAllNotes();
        expect(Array.isArray(notes)).toBe(true);
        expect(notes.length).toBeGreaterThanOrEqual(1);
    });

    it('should return one note', () => {
        addNote('Test note', 'Test content');

        const note = getNoteById(1);
        expect(note).toBeDefined();
        expect(note.id).toBe(1);
    });

    it('should update a note', () => {
        addNote('Test note', 'Test content');

        const updated = updateNote(1, 'Titre MAJ', 'Contenu MAJ');
        expect(updated).toBeDefined();
        expect(updated.title).toBe('Titre MAJ');
        expect(updated.content).toBe('Contenu MAJ');
    });

    it('should delete one note', () => {
        addNote('Test note', 'Test content');

        const deleted = deleteNote(1);
        expect(deleted).toBeDefined();
        expect(deleted.id).toBe(1);
    
        const afterDelete = getNoteById(1);
        expect(afterDelete).toBeUndefined();
    });
});