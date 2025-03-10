let notes = [];
let nextId = 1;

const addNote = (title, content) => {
    const note = { id: nextId++, title, content };
    notes.push(note);
    return note;
};

const getAllNotes = () => notes;

const getNoteById = (id) => notes.find(note => note.id === id);

const updateNote = (id, newTitle, newContent) => {
    const note = getNoteById(id);
    if (note) {
        note.title = newTitle;
        note.content = newContent;
    }
    return note;
};

const deleteNote = (id) => {
    const index = notes.findIndex(note => note.id === id);
    if (index !== -1) {
        return notes.splice(index, 1)[0];
    }
    return null;
};

const resetNotes = () => {
    notes = [];
    nextId = 1;
};

module.exports={
    addNote,getAllNotes,getNoteById,updateNote, deleteNote, resetNotes
}