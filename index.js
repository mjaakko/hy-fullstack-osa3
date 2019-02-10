require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')

const Person = require('./models/person')

app.use(bodyParser.json())

morgan.token('body', req => req ? JSON.stringify(req.body) : "")
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.use(express.static('frontend'))

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError' && error.kind == 'ObjectId') {
      return response.status(400).send({ error: 'invalid id' })
    } 
  
    next(error)
}

app.use(errorHandler)
  
app.get('/info', (req, res, next) => {
  Person.find({}).then(persons => {
    res.send(`Puhelinluettelossa on ${persons.length} henkilön tiedot<br/>${new Date().toString()}`)
  }).catch(error => next(error))
})

app.get('/api/persons', (req, res, next) => {
  Person.find({}).then(persons => {
    res.json(persons.map(person => person.toJSON()))
  }).catch(next => next(error))
})

app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id).then(person => {
        if (person) {
            res.json(person.toJSON())
        } else {
            res.status(404).end()
        }
    }).catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndDelete(req.params.id).then(result => {
        res.status(204).end()
    }).catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
    const body = req.body
  
    const person = {
      name: body.name,
      number: body.number,
    }
  
    Person.findByIdAndUpdate(req.params.id, person, { new: true }).then(updatedPerson => {
        res.json(updatedPerson.toJSON())
    }).catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
    const body = req.body
    console.log(body)

    if (body.name === undefined || body.number === undefined) {
        return res.status(400).json({ 
            error: 'content missing' 
        })
    }

    Person.find({name: body.name}).then(persons => {
        if (persons.length > 0) {
            res.status(400).json({
                error: 'name must be unique'
            })
        } else {
            const person = new Person({
                id: random(1000000),
                name: body.name,
                number: body.number
            })

            return person.save().then(savedPerson => {
                res.json(person.toJSON())
            })
        }
    }).then(error => next(error))
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

const random = max => Math.floor(Math.random() * Math.floor(max))
