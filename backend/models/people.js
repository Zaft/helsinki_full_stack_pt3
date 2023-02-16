
const mongoose = require('mongoose')

mongoose.set('strictQuery',false)
require('dotenv').config()

const url = process.env.MONGODB_URI
console.log('connecting to', url)

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
})

// Note on phone number validation:
// The validation the number must in the format: `DDD-DDD-DDDD`
const personSchema = new mongoose.Schema({
    name: {
      type: String,
      minLength: 3
    },
    number: {
      type: String,
      minLength: 8,
      validate: {
        validator: function(v) {
          let isValid = false
          // valid if all digits
          isOnlyNumbers = /^[0-9]*$/.test(v)
          if (isOnlyNumbers) return true
          // console.log("only numbers check", isValid)

          // starts with two or three digits, followed by only digits
          isValid = /^\d{2,3}-[0-9]*$/.test(v)
          // console.log("hyphen check is valid", isValid)
          
          return isValid
        }
      },
      required: [true, 'User phone number required']
    }
})

const Person = mongoose.model('Person', personSchema)

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)