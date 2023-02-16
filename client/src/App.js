import { useEffect, useState } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personService from './services/persons'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setNewFilter] = useState('')
  const [message, setMessage] = useState(null)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    // console.log("use effect")
    personService
      .getAll()
      .then(persons => {
        console.log("getAll", persons)
        setPersons(persons)
      })
  }, [])

  const peopleToShow = filter.length 
    ? persons.filter(person => person.name.toLocaleLowerCase().includes(filter.toLocaleLowerCase()))
    : persons;

  const handleSubmit = (event) => {
    event.preventDefault();
    // validate name does not already exist
    let existingPerson = persons.find(person => 
      person.name.toLocaleLowerCase() === newName.toLocaleLowerCase()
    );
    // console.log("handleSubmit, nameExists", nameExists);
    if (!existingPerson) {
      const newPersonObject = {
        name: newName,
        number: newNumber
      }
      personService
        .create(newPersonObject)
        .then(newPerson => {
          // console.log("newPerson", newPerson)
          setPersons(persons.concat(newPerson))
          setIsError(false)
          setMessage(
            `Added ${newPerson.name} to phonebook`
          )
          setTimeout(() => { setMessage(null)}, 5000)

      }).catch(error => {
        setIsError(true)
        setMessage(error.response.data.error)
        console.log(error.response.data.error)
      })

      setNewName('')
      setNewNumber('')
    }
    else {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)){
        const newPersonObject = {...existingPerson, number:newNumber};
        // console.log("update", newPersonObject)
        personService
          .update(newPersonObject.id, newPersonObject)
          .then(newPerson => {
            setPersons(persons.map(p => p.id !== newPersonObject.id ? p : newPerson))
            setIsError(false)
            setMessage(
              `Number for ${newPersonObject.name} updated`
            )
            setTimeout(() => { setMessage(null)}, 5000)
          })
          .catch(error => {
            setIsError(true)
            setMessage(
              `Information for ${newPersonObject.name} has already been deleted from server`
            )
            setTimeout(() => { setMessage(null)}, 5000)
            
          })

          setNewName('')
          setNewNumber('')
      }
    } 

    console.log("handleSubmit", event.target.value)
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)
  }
  
  const handleDelete = (id) => {
    // console.log("handleDelete", id)
    let person = persons.find(person => person.id === id)
    // console.log("handleDelete, person", person)
    if(window.confirm(`Delete ${person.name}`)){
      personService
        .deletePerson(id)
        .then(() => {
          // console.log("delete filter id", id)
          setPersons(persons.filter(person => person.id !== id))
        })
    }
  }

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification message={message} isError={isError}/>
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <h3>Add a new</h3>
      <PersonForm 
        handleSubmit={handleSubmit}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
        handleFilterChange={handleFilterChange}
      ></PersonForm>
      <h3>Numbers</h3>
      <Persons peopleToShow={peopleToShow} handleDelete={handleDelete} />
    </div>
  )
}

export default App