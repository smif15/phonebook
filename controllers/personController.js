const personRouter = require('express').Router()
const Person = require('../models/person')

personRouter.get('', (req, res, next) => {
    Person.find({}).then(persons => {
        res.json(persons)
    }).catch(err => next(err))
})

personRouter.get('/:id', (req, res, next) => {
    const id = req.params.id
    Person.findById(id).then(person => {
        if(person){
            res.json(person)
        } else {
            res.status(404).json({ message: 'Data isn\'t exist' })
        }
    }).catch(err => next(err))
})

personRouter.get('/info', (req, res, next) => {
    Person.countDocuments().then(countPersons => {
        res.send(`
        <p>Phonebook has info for ${countPersons} people</p>

        <p>${req.start}</p>
        `)
    }).catch(err => next(err))
})

personRouter.delete('/:id', (req, res, next) => {
    const id = req.params.id

    Person.findByIdAndDelete(id)
        .then(deletePerson => {
            if(deletePerson) {
                res.json({ message: `Data who has id ${id} has been deleted` })
            } else {
                res.status(404).json({ message : 'Data isn\'t exists' })
            }
        })
        .catch(err => next(err))
})

personRouter.post('', (req, res, next) => {
    const body = req.body

    Person.find({ name: body.name }).then(person => {
        //ini gausah gpp aslinya
        if(person.length !== 0){
            res.status(409).json({ message : `Data ${body.name} is already added` })
        } else {
            const newPerson = new Person( {
                name: body.name, number: body.number
            })

            newPerson.save().then(savedPerson => res.json(savedPerson))
                .catch(err => next(err))
        }
    })

})

personRouter.put('/:id', (req, res, next) => {
    const { name, number } = req.body
    const id = req.params.id

    Person.findById(id).then(person => {
        if(!person) {
            res.status(404).json({ message: 'Data has not exist' })
        }
        person.name = name
        person.number = number
        person.save().then(updatedPerson => res.json(updatedPerson))
            .catch(err => next(err))

    }).catch(err => next(err))
})

module.exports = personRouter