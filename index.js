require('dotenv').config();
const express = require('express')
const app = express()

const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')



app.use(cors())
app.use(express.static('build'))
app.use(express.json())


// const url =
// `mongodb+srv://fullstackmongo:Beknazar1@cluster0.jpc0j.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
// mongoose.connect(url)

app.use(morgan((tokens, req, res) => {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    JSON.stringify(req.body)
  ].join(' ')
}))

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

app.use(errorHandler)

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
  })

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
    
  })


app.get('/info', (request, response) => {
    const currentDate = new Date().toLocaleString();
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
        response.send(`
            <div>
                <p>Phonebook has info for ${persons.length} people</p>
            </div>
            <div>
                <p>${currentDate} (${timeZone})</p>
            </div>`
        )
        
})

app.get('/api/persons/:id', (request, response)=>{
  const id = Number(request.params.id)
  console.log('id', id)
  const person = persons.find(person => person.id === id)
  if (person) {
    response.json(person)  
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response, next)=>{
  Person.findByIdAndRemove(request.params.id)
  .then(result => {
    response.status(204).end()
  }).catch(error => next(error))
})

// const generateId = () => {
//   const maxId = persons.length > 0 ? Math.max(...persons.map(p=>p.id) ) : 0 
//   return maxId + 1
// }

app.post('/api/persons/', (request, response) => {  
  const body = request.body
  
  if (!body.name ){
    return response.status(400).json({
      error: 'name missing'
    })
  } else if (!body.number){
    return response.status(400).json({
      error: 'number is missing'
    })
  }

  const person = new Person({
    // id: generateId(),
    name: body.name,
    number : body.number
  })

  person.save().then(savedPerson =>{
    response.json(savedPerson)
  })
})

app.put('/api/persons/:id', (request, response, next)=>{
  const body = request.body

  const person = {
    name: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(request.params.id, person, {new: true})
  .then (updatedPerson => {
    response.json(updatedPerson)
  }).catch(error => next(error))
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})