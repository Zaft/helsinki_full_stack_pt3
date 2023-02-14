const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
app.use(express.json())
app.use(cors())
// app.use(requestLogger)
// app.use(unknownEndpoint)
morgan.token('body', function (req, res) { return JSON.stringify(req.body) })
// morgan('tiny')
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


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
    response.json(persons)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    // console.log('delete id', id)
    persons = persons.filter(p => p.id !== id)
    response.status(204).end()
    // console.log('after delete, ', persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    // console.log(id)
    let person = persons.find(p => p.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
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

    let nameExists = persons.find(p => p.name.toLocaleLowerCase() == body.name.toLocaleLowerCase())
    if (nameExists) {
        return response.status(409).json({
            error: 'name must be unique'
        })
    }

    // console.log('POST person ', request.body)
    let id = Math.floor(Math.random() * 5000)
    const person = {
        id: id,
        name: body.name,
        number: body.number
    }
    persons = persons.concat(person)
    // console.log("persons ", persons)
    
    response.json(person)
})

app.get('/api/info/', (request, response) => {
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

    response.send(`<p>Phonebook has info for ${persons.length} people</p>
        <p>${ts}</p>`)
})

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
