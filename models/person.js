const mongo = require('mongoose');

const url = process.env.MONGODB_URI;
console.log('connecting to ', url);

mongo.connect(url, {family: 4})
    .then(res => {console.log('connected to MongoDB')})
    .catch(error => {console.log('error connecting to MongoDB : ', error)});

const personSchema = new mongo.Schema({
    name: String,
    name: {
        type: String,
        minLength: [5, 'The minimum length of name is 5'],
        required: true
    },
    number: {
        type: String,
        validate: {
            validator: function(v) {
                return /^\d{3}-\d{3}-\d{4}$/.test(v);
            },
            message: props => `${props.value} is not a valid phone number`
        },
        minLength: [8, 'The minimum length of number phone is 8'],
        required: [true, 'User number phone is required']
    }
});

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
})

module.exports = {
    Person : mongo.model('Person', personSchema)
}


