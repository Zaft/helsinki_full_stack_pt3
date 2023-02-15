require('dotenv').config()
const Person = require('./models/people')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
app.use(express.static('build'))
app.use(express.json())
app.use(cors())
// app.use(unknownEndpoint)
morgan.token('body', function (req, res) { return JSON.stringify(req.body) })
// morgan('tiny')
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
const mongoose = require('mongoose')

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck (be)", 
      "number": "39-23-6423122"
    }
]

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
  })

app.get('/api/persons/', (request, response) => {
    // response.json(persons)
    console.log("getAll")
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    console.log('delete id', id)
    Person.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
    // const id = mongoose.Types.ObjectId(request.params.id)
    const id = request.params.id
    console.log("get person by id ", id)
    Person.findById(id)
        .then(person => {
            if (person) {
                response.json(person)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    console.log("put body", request.body)
    console.log("put params", request.params)
    const body = request.body
    const person = {
        name: body.name,
        number: body.number
    }

    Person.findByIdAndUpdate(request.params.id, person, { new: true })
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error => next(error))
})

app.post('/api/persons', (request, response) => {
    // console.log("request headers", request.headers)
    // console.log("request body", request.body)
    let body = request.body
    if (!body) {
        return response.status(400).json({
            error: 'content missing'
        })
    }

    if (body.name.length === 0 || body.number.length === 0) {
        return response.status(400).json({
            error: 'name and number are required fields'
        })
    }

    const person = new Person({
        name: body.name,
        number: body.number
    })
    // console.log("new person", person)
    Person.create(person).then(person => {
        console.log('person saved!')
        response.json(person)
    })
})

app.get('/api/info/', (request, response) => {

    Person.find({}).then(persons => {
        // response.json(persons)
        const personCount = persons.length
        const dateObject = new Date();
        // current date
        // adjust 0 before single digit date
        const date = (`0 ${dateObject.getDate()}`).slice(-2);
        // current month
        const month = (`0 ${dateObject.getMonth() + 1}`).slice(-2);
        // current year
        const year = dateObject.getFullYear();
        // current hours
        const hours = dateObject.getHours();
        // current minutes
        const minutes = dateObject.getMinutes();
        // current seconds
        const seconds = dateObject.getSeconds();
        const ts = new Date(Date.now()).toLocaleString();
        const tz = new Date().getTimezoneOffset()
        response.send(`<p>Phonebook has info for ${personCount} people</p>
            <p>${ts}</p>`)
    })

})

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}
app.use(requestLogger)

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } 
  
    next(error)
  }
app.use(errorHandler)
