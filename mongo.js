const mongo = require('mongoose');

if(process.argv.length < 3) {
    console.log('give password as parameter');
    process.exit(1);
}

const password = process.argv[2];
const url = `mongodb+srv://fims:${password}@phonebook.ktwgfto.mongodb.net/?appName=phonebook`;
mongo.set('strictQuery', false);

mongo.connect(url, {family: 4});

const personSchema = new mongo.Schema({
    name: String,
    number: String,
})

const Person = mongo.model('Person', personSchema);


if(process.argv.length === 5) {
    const [ , , , name, number ] = process.argv;
    
    const person = new Person({
        name,
        number
    })
    
    person.save().then(res => {
        console.log(`Added ${name} number ${number} to phonebook`);
        mongo.connection.close();
    })
} else if(process.argv.length === 3) {
    Person.find({}).then(res => {
        res.forEach(p => console.log(p));
    
        mongo.connection.close();
    })
} else {
    console.log('give password, name, and number sequentially');
    process.exit(1);
}

