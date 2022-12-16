const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')
const dataJson = require('./persons.json')

let persons = dataJson

app.use(express.static('build'))
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.use(morgan((token, request, response) => {
    return [
      token.method(request, response),
      token.url(request, response),
      token.status(request, response),
      token.res(request, response, "content-length"),
      "-",
      token["response-time"](request, response),
      "ms",
      JSON.stringify(request.body),
    ].join(" ");
  })
);


// Persons Data
app.get('/api/persons', (req, res) => {
    res.json(persons)
})

// infoPage HTML Code for the info Response
const infoPage = `
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${Date()}
`
// Information Page Response
app.get('/api/info', (req, res) => {
    res.send(infoPage)
})

// Using id parameters for a single person's output
app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(thePerson => thePerson.id === id)
    if(person){
        res.json(person)
    }
    else{
        res.send('person doesnt exist')
    }
})

// Deleting a person using id parameter
app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(item => item.id !== id)
  res.status(204).end()
})

// ID generator for adding a new person
const generateId = () => {
    const ID = persons.length > 0
      ? Math.random() * 1000
      : 0
    return ID.toFixed(0)
  }

// Adding a New Person
app.post('/api/persons', (req,res) => {
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
    else if(persons.some(pr => pr.name == body.name)){
        return res.status(400).json({ 
            error: 'name must be unique' 
        })
    }
  
    const person = {
        id: Number(generateId()),
        name: body.name,
        number: body.number,
    }
  
    persons = persons.concat(person)
  
    res.json(person)
})
  

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})