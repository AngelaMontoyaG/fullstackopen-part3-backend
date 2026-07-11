import { useState, useEffect } from 'react'
import personService from './services/persons'
import Notification from './components/Notification'

import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'

const App = () => {
   const [contacts, setContacts] = useState([]) 
   const [newName, setNewName] = useState('')
   const [newNumber, setNewNumber] = useState('')
   const [searchTerm, setSearchTerm] = useState('')
   const [errorMessage, setErrorMessage] = useState(null)
   const [notificationType, setNotificationType] = useState('success')


   /* Process: Initial Data Fetching
    * Synchronizes the local component state with the backend server 
    * on the initial application render.*/
   useEffect(() => {
      personService.getAll().then(initialPersons => {console.log('What is arriving from the backend?:', initialPersons) 
      setContacts(initialPersons)})
      }, [])

   /**
    * Process: Contact Management (Creation & Updates)
    * Handles the lifecycle of adding a person. Evaluates if the name exists 
    * to trigger either an HTTP PUT (update) or an HTTP POST (creation).
    */
   const addContact = (event) => {
      event.preventDefault()

      const contactExists = contacts.find(
         (contact) => contact.name.toLowerCase() === newName.toLowerCase()
      )

      if (contactExists) {
            const confirmUpdate = window.confirm(
            `${newName} is already added to phonebook, replace the old number with a new one?`
         )

         if (confirmUpdate) {
            const changedContact = { ...contactExists, number: newNumber }

            /**
             * Sub-process: Update Existing Entry (PUT Request)
             * Overwrites the phone number of a pre-existing contact, refreshes state, 
             * and handles 404 errors gracefully if the entry was deleted externally.
             */
            personService
               .update(contactExists.id, changedContact)
               .then(response => {
                  console.log('Server responded successfully', response)
                  
                  setContacts(contacts.map(c => c.id !== contactExists.id ? c : response))
                  setNewName('')
                  setNewNumber('')

                  setErrorMessage(`Added ${response.name}`)
                  setNotificationType('success')
                  setTimeout(() => {
                     setErrorMessage(null) 
                  }, 5000)
               })
               .catch(error => {
                  // Access the error message sent by the backend
                  const backendError = error.response.data.error
                  console.error('Validation failed:', backendError)

                  setErrorMessage(backendError)
                  setNotificationType('error')

                  setTimeout(() => {
                     setErrorMessage(null)
                  }, 5000)
               })
         }
         
         return 
      }

      /**
       * Sub-process: Create New Entry (POST Request)
       * Dispatches a fresh contact record to the server, appends it 
       * to the local rendering array, and clears the form inputs.
       */
      const contactObject = {
         name: newName,
         number: newNumber,
         important: Math.random() < 0.5,
      }

      personService.create(contactObject)
      .then(returnedContact => {
         setContacts(contacts.concat(returnedContact))
         setNewName('')
         setNewNumber('')

         setErrorMessage(`Added ${returnedContact.name}`)
         setNotificationType('success')
            setTimeout(() => {
               setErrorMessage(null)
            }, 5000)
      })
      .catch(error => {
         const backendError = error.response.data.error
         console.error('Validation failed during POST:', backendError)

         setErrorMessage(backendError)
         setNotificationType('error') 

         setTimeout(() => {
            setErrorMessage(null)
         }, 5000)
      })
   }


   /* Process: User Input Event Handlers
    * Synchronizes the controlled form fields and search boxes 
    * with React's component state.
    */
   const handleNameChange = (event) => {
      setNewName(event.target.value)
   }

   const handleNumberChange = (event) => {
      setNewNumber(event.target.value)
   }

   const handleFilterChange = (event) => {
      setSearchTerm(event.target.value)
   }

   /*Process: Search Filtering Logic
    * Computes a dynamic subset of contacts to display based on whether 
    * names partially match the string stored in 'searchTerm'.
    */
   const contactsToShow = contacts.filter(contact => 
      contact.name.toLowerCase().includes(searchTerm.toLowerCase())
   )


   /*Process: Contact Removal (DELETE Request)
    * Prompts user validation before issuing a DELETE call to the API. 
    * Syncs the UI by filtering out the target ID from the local layout.
    */
   const deleteContactOf = (id) => {
      const contact = contacts.find(c => c.id === id)
      
      if (window.confirm(`Delete ${contact.name}?`)) {
         personService
            .deleteContact(id)
            .then(() => {
               setContacts(contacts.filter(c => c.id !== id))

               setErrorMessage(`Deleted ${contact.name}`)
               setNotificationType('success')
               setTimeout(() => setErrorMessage(null), 5000)
            })
            .catch(error => {
               console.error('Error during DELETE request:', error)
               setErrorMessage(`The contact '${contact.name}' was already deleted from server`)
               setNotificationType('error')
               setContacts(contacts.filter(c => c.id !== id))
               setTimeout(() => setErrorMessage(null), 5000)
            })
      }
   }

   return (
      <>
         <h1>Phonebook</h1>
         <Notification message={errorMessage} type={notificationType} />

         <Filter 
            searchTerm={searchTerm} 
            handleFilterChange={handleFilterChange} 
            contactsToShow={contactsToShow}
            deleteContact={deleteContactOf}
         />
         <br />
         <hr />
         
         <h1>Add a new</h1>
         <PersonForm 
            addContact={addContact}
            newName={newName}
            handleNameChange={handleNameChange}
            newNumber={newNumber}
            handleNumberChange={handleNumberChange}
         />
         
         <h1>Numbers</h1>
         <Persons contacts={contacts} deleteContact={deleteContactOf}/>
      </>
   )
}

export default App