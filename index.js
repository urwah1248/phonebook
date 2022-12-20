require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')
const Person = require('./models/person')
const { response } = require('express')


// let persons = dataJson

app.use(express.static('build'))
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.use(morgan((token, request, response) => {
    return [
        token.method(request, response),
        token.url(request, response),
        token.status(request, response),
        token.res(request, response, 'content-length'),
        '-',
        token['response-time'](request, response),
        'ms',
        JSON.stringify(request.body),
    ].join(' ')
})
)

// Persons Data
app.get('/api/persons', (req, res) => {
    Person.find({}).then(person => {
        res.json(person)
    })
})

// infoPage HTML Code for the info Response



// Information Page Response
app.get('/api/info', (req, res) => {
    Person.find({}).then(person => {
        res.send(`
            <p>Phonebook has info for ${person.length} people</p>
            <p>${Date()}
        `)
    })
})

// Using id parameters for a single person's output
app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id).then(person => {
        res.json(person)
    })
        .catch(err => next(err))
})

// Deleting a person using id parameter
app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndRemove(req.params.id).then((result) => {
        response.send(result)
        response.status(204).end()
    })
        .catch(err => next(err))
})

// ID generator for adding a new person
// const generateId = () => {
//     const ID = persons.length > 0
//         ? Math.random() * 1000
//         : 0
//     return ID.toFixed(0)
// }

// Adding a New Person
app.post('/api/persons', (req,res, next) => {
    const body = req.body

    if (!body.name || !body.number) {
        if(!body.name && body.number){
            return res.status(400).json({
                error: 'missing name'
            })
        }
        else if(body.name && !body.number){
            return res.status(400).json({
                error: 'missing number'
            })
        }
        else{
            return res.status(400).json({
                error: 'missing parameters'
            })
        }
    }

    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person.save().then(() => {
        res.json(person)
    })
        .catch(err => next(err))
})

app.put('/api/persons/:id', (req, res, next) => {
    const body = req.body

    const person = {
        name: body.name,
        number: body.number,
    }

    Person.findByIdAndUpdate(req.params.id, person, { new: true })
        .then(updatedPerson => {
            res.json(updatedPerson)
            console.log(updatedPerson)
        })
        .catch(error => next(error))
})

const errorHandler = (err, req, res, next) => {
    console.error(err.message)

    if (err.name === 'CastError') {
        return res.status(400).send({ error: 'malformatted id' })
    } else if (err.name === 'ValidationError') {
        return res.status(400).json({ error: err.message })
    }
    next(err)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})