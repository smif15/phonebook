const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
];

const app = new express();

app.use(cors());

app.use(express.static(path.join(__dirname, 'dist')));

app.use((req, res, next) => {
    req.start = new Date().toDateString();
    next();
})


app.use(express.json())

app.use(
    morgan(function (tokens, req, res) {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms',
        JSON.stringify(req.body)
    ].join(' ')
}));

app.get('/api/persons', (req, res) => {
    res.json(persons);
});

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id;
    const person = persons.find(p => p.id === id);

    if(person){
        res.json(person);
    } else {
        res.status(404).json({message: 'Data isn\'t exist'});
    }
});

app.get('/info', (req, res) => {
    const countPersons = persons.length;
    res.send(`
        <p>Phonebook has info for ${countPersons} people</p>

        <p>${req.start}</p>
        `);
})

app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id;

    const newPersons = persons.filter(p => p.id !== id);

    if(newPersons.length === persons.length){
        res.status(400).json({message : 'Data isn\'t exists'});
    } else{
        persons = newPersons;
        res.json({message: 'Data has been deleted'});
    }
})

app.post('/api/persons', (req, res) => {
    const body = req.body;

    const id = Math.floor(Math.random() * 200000000);

    if(!body.name || !body.number) {
        res.status(400).json({error: "Invalid data"});
        return;
    }

    if(persons.find(p => p.name === body.name)){
        res.status(400).json({error: "name has been already exist"});
        return;
    }

    const newPerson = {
        id: id.toString(), name: body.name, number: body.number
    }

    persons.push(newPerson);
    res.json(newPerson);
})

app.use((req, res) => {
    res.status(404).json({error: 'unknown endpoint'});
})


const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Aplikasi berjalan pada port ${PORT}`);
});