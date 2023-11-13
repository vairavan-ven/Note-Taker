const express = require('express');
const fs = require('fs');
const path = require('path');
const uuid  = require('uuid'); 

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the "public" folder
app.use(express.static('public'));


// Define routes for serving HTML files
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

// Read notes from the db.json file
const readNotes = () => {
    const data = fs.readFileSync('db.json', 'utf8');
    return JSON.parse(data) || [];
};

// Write notes to the db.json file
const writeNotes = (notes) => {
    fs.writeFileSync('db.json', JSON.stringify(notes, null, 2), 'utf8');
};

// GET route to retrieve all notes
app.get('/api/notes', (req, res) => {
    const notes = readNotes();
    res.json(notes);
});

// POST route to save a new note
app.post('/api/notes', (req, res) => {
    const newNote = req.body;
    newNote.id = uuid.v4(); // Assign a unique id using the uuid package
    const notes = readNotes();
    notes.push(newNote);
    writeNotes(notes);
    res.json(newNote);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });