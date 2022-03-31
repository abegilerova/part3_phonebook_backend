require('dotenv').config();
const express = require('express')
const app = express()
app.use(express.json())
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')



app.use(cors())
app.use(express.static('build'))

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

app.delete('/api/persons/:id', (request, response)=>{
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  response.status(204).end() 
})

const generateId = () => {
  const maxId = persons.length > 0 ? Math.max(...persons.map(p=>p.id) ) : 0 
  return maxId + 1
}

app.post('/api/persons/', (request, response) => {  
  const body = request.body

  let nameExists = persons.some(person => person.name === body.name)
  
  if (!body.name ){
    return response.status(400).json({
      error: 'name missing'
    })
  } else if (!body.number){
    return response.status(400).json({
      error: 'number is missing'
    }) 
  } else if (nameExists){
    return response.status(400).json({
      error: 'name already exists'
    })

    }

  const person = {
    id: generateId(),
    name: body.name,
    number : body.number
  }

  persons= persons.concat(person)
  response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})