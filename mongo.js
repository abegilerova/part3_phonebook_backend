const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const url =
`mongodb+srv://fullstackmongo:${password}@cluster0.jpc0j.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
  name: 'Beknazar Z',
  number: '35353535325'
})

person.save().then(result => {
  console.log('person saved!')
  mongoose.connection.close()
})


