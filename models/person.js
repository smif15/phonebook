const mongo = require('mongoose');

const url = process.env.MONGODB_URI;
console.log('connecting to ', url);

mongo.connect(url, {family: 4})
    .then(res => {console.log('connected to MongoDB')})
    .catch(error => {console.log('error connecting to MongoDB : ', error)});

const personSchema = new mongo.Schema({
    name: String,
    number: String
});

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
})

module.exports = mongo.model('Person', personSchema)


