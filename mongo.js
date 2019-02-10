const mongoose = require('mongoose')

if ( process.argv.length<3 ) {
  console.log('Anna salasana komentoriviparametrina')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://fullstack:${password}@cluster0-bwrzv.mongodb.net/test?retryWrites=true`

mongoose.connect(url, { useNewUrlParser: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: Number,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length < 5) {
    console.log("puhelinluettelo")
    Person
        .find({})
        .then(persons=> {
            persons.forEach(person => console.log(`${person.name} - ${person.number}`))
            mongoose.connection.close()
        })
} else {
    const name = process.argv[3]
    const number = Number(process.argv[4])

    const person = new Person({
        name,
        number,
    })

    person.save().then(response => {
        console.log(`Lisättiin ${name} numerolla ${number}`);
        mongoose.connection.close();
    })
}