/* eslint-disable no-undef */
const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const url =
  `mongodb+srv://fullstack:${password}@cluster0.nenx8oc.mongodb.net/?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})
const Person = mongoose.model('Person', personSchema)

// we are running fetch all
if (process.argv.length<4) {
  console.log('phone book:')
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })

} else {
  console.log('Create new person')
  const name = process.argv[3]
  const number = process.argv[4]
  const person = new Person({
    //   id: 11,
    name: name,
    number: number
  })
  console.log('new person', person)

  // eslint-disable-next-line no-unused-vars
  person.save().then(result => {
    console.log('person saved!')
    mongoose.connection.close()
  })
}



