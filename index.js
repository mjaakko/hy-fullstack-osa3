const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

app.use(cors())

morgan.token('body', req => req ? JSON.stringify(req.body) : "")

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(bodyParser.json())

let persons = [
    {
        id: 1,
        name: "Erkki Esimerkki",
        number: 123
    },
    {
        id: 5,
        name: "dsfa",
        number: 29318,
    }
]

app.get('/info', (req, res) => {
  res.send(`Puhelinluettelossa on ${persons.length} henkilön tiedot<br/>${new Date().toString()}`)
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)

    const person = persons.find(person => person.id === id)

    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)
  
    res.status(204).end();
})

app.post('/api/persons', (req, res) => {
    const body = req.body
    console.log(body)

    if (body.name === undefined || body.number === undefined) {
        return res.status(400).json({ 
            error: 'content missing' 
        })
    }

    const containsName = persons.find(person => person.name === body.name)
    if (containsName) {
        return res.status(400).json({
            error: 'name must be unique'
        })
    }

    const person = {
        id: random(1000000),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person)

    res.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

const random = max => Math.floor(Math.random() * Math.floor(max))
