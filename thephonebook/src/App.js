
import { useState, useEffect } from 'react'

import personservice from './services/persons'


const Notification = ({message}) =>{

  if (message === null){
    return null
  }

  const notistyle = {
    color: 'green',
  background: 'lightgrey',
  fontSize: 20,
  borderStyle: 'solid',
  borderadius: 5,
  padding: 10,
  marginbottom: 10

  }

  return (
    <div style={notistyle}>
        <em>{message}</em>
    </div>
  )
}

const Filter = ({persons}) => {

  
  const [newSearch, setSearch] = useState('')

  const handleSearch = (event) => {

    setSearch(event.target.value)
  }

  const removeDups = ele => {

    if (newSearch === ''){
      return false
    }

    return ele.name.toLowerCase().includes(newSearch.toLowerCase())
  }


  return (
    <div>
      <input value={newSearch} onChange={handleSearch} />

      {persons.filter(removeDups).map((each) => <p key={each.name} >{each.name} {each.number}</p>) }


    </div>
  )
}

const PersonsForm = ({persons,setPersons,setNoti}) =>{

  const [newName,setNewName] = useState('')
  const [newNum,setnewNum] = useState('')

  const handleNumChange = (event) =>{
    setnewNum(event.target.value)
  }

  const handleNameChange = (event) =>{
    setNewName(event.target.value)
  }

  const handleSubmit = (event) => {

    event.preventDefault()
    console.log(event.target)

    const n = persons.filter((each) => each.name === newName)
    
    if (n.length > 0){
      
      if (window.confirm("Do u want to replace the old number with new one?")){

        const newPerson = { ...n[0], number : newNum}

        personservice
        .update(newPerson.id,newPerson)
        .then(response => {
          console.log("Done");

          setNoti(newName + " was updated")

          setTimeout(() =>{
            setNoti(null)
          },5000)
          personservice
          .getAll()
          .then(response => {
            setPersons(response.data)
          }).catch( () => {
            setNoti(newName + " was Deleted")

            setTimeout(() => {
              setNoti(null)
            },5000)
          })

          
        })
      }

      setNewName("")
      setnewNum('')
      return 
    }

    

    const persObj = {
      name: newName,
      number: newNum
    }

    
    setNewName("")
    setnewNum('')

    setPersons(persons.concat(persObj))

    personservice
    .create(persObj)
    .then(response => {
      console.log(response)

      personservice
      .getAll()
      .then(response => {
        setPersons(response.data)

        setNoti(persObj.name + " was Added")

        setTimeout( () => {
          setNoti(null)
        },5000)

      })
    })
  }



  return (
    <div>
    <form onSubmit={handleSubmit}>
        <div>name: <input value = {newName} onChange={handleNameChange}/></div>
        <div>number: <input value={newNum} onChange={handleNumChange} /></div>
        <div><button type="submit">add</button></div>
    </form>
    </div>

  )
}

const Persons = ({persons, doDel}) => {

  return(
    <div>
      {persons.map((each) =><p key={each.name}>{each.name} {each.number}   <button onClick={() => (doDel(each.id,each.name))}> Delete</button> </p> )}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([]) 

  const [notti, setNoti] = useState(null)


  useEffect(() => {
    personservice
    .getAll()
    .then(response => {
      setPersons(response.data)
    })
  },[])

  console.log('before');

  const doDel = (id,name) => {

    if (!window.confirm(`Are you sure you want to delete ${name} ?`)){
      return
    }


    personservice
    .delPers(id)
    .then(response => {
      console.log(`${name} has been deleted`);
      personservice
      .getAll()
      .then(response => {
        setPersons(response.data)
      })
      }).catch( () => {
      setNoti(name + " was Deleted")

      setTimeout(() => {
        setNoti(null)
      },5000)
    })
  } 

  return (
    <div>

      <h1>Phonebook</h1>

      <Notification message={notti} />


      <h2>Find a Number</h2>
      
      <Filter persons={persons} />

      <h2>Add a Number</h2>

      <PersonsForm persons={persons} setPersons={setPersons} setNoti={setNoti}/>

      <h2>Numbers</h2>

      <Persons persons={persons} doDel={doDel} />
      
    </div>
  )
}

export default App