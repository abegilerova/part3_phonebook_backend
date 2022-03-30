const express = require('express')
const app = express()
app.use(express.json())

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
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]


app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
  })

app.get('/api/persons', (request, response) => {
    response.json(persons)
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