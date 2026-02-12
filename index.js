require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const { Person } = require('./models/person');

const PORT = process.env.PORT;
const app = new express();

app.use(express.static(path.join(__dirname, 'dist')));

app.use((req, res, next) => {
    req.start = new Date().toDateString();
    next();
})

//middleware json-parser: diletakkan di awal untuk mentransform body ke dalam json shg dapat digunakan
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

app.get('/api/persons', (req, res, next) => {
    Person.find({}).then(persons => {
        res.json(persons);
    })
    .catch(err => next(err));
});

app.get('/api/persons/:id', (req, res, next) => {
    const id = req.params.id;
    Person.findById(id).then(person => {
        if(person){
            res.json(person)
        } else {
            res.status(404).json({message: 'Data isn\'t exist'});
        }
    }).catch(err => next(err));
});

app.get('/info', (req, res, next) => {
    Person.countDocuments().then(countPersons => {
        res.send(`
        <p>Phonebook has info for ${countPersons} people</p>

        <p>${req.start}</p>
        `);
    })
    .catch(err => next(err));
});

app.delete('/api/persons/:id', (req, res, next) => {
    const id = req.params.id;

    Person.findByIdAndDelete(id)
        .then(deletePerson => {
            if(deletePerson) {
                res.json({message: `Data who has id ${id} has been deleted`});
            } else {
                res.status(404).json({message : 'Data isn\'t exists'});
            }
        })
        .catch(err => next(err));
})

app.post('/api/persons', (req, res, next) => {
    const body = req.body;

    if(!body.name || !body.number) {
        res.status(400).json({message: "Invalid data"});
        return;
    }

    Person.find({name: body.name}).then(person => {
        //ini gausah gpp aslinya
        if(person.length !== 0){
            res.status(409).json({message : `Data ${body.name} is already added`});
        } else {
            const newPerson = new Person( {
                name: body.name, number: body.number
            });

            newPerson.save().then(savedPerson => res.json(savedPerson))
                .catch(err => next(err));
        }
    })

});

app.put('/api/persons/:id', (req, res, next) => {
    const { name, number } = req.body;
    const id = req.params.id;

    if(!name || !number) {
        res.status(400).json({message: "Invalid data"});
        return;
    }

    Person.findById(id).then(person => {
        if(!person) {
            res.status(404).json({message: "Data has not exist"})
        }
        person.name = name;
        person.number = number;
        person.save().then(updatedPerson => res.json(updatedPerson))
            .catch(err => next(err));

    })
    .catch(err => next(err));
});

//middleware path undefined : diletakkan setelah pendefinisian semua routes selesai
app.use((req, res) => {
    res.status(404).json({message: 'unknown endpoint'});
})

//middleware menangani error : diletakkan di akhir
app.use((err,req,res,next) => {
    console.error('ERROR : ', err);

    if(err.name === 'CastError'){
        return res.status(400).send({'message' : 'malformatted id'});
    } else {
        return res.status(400).send({'message' : 'error in client side'});
    }

    next(err);
})


app.listen(PORT, () => {
    console.log(`Aplikasi berjalan pada port ${PORT}`);
});