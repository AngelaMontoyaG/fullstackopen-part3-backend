const PersonForm = ({ addContact, newName, handleNameChange, newNumber, handleNumberChange }) => {
   return (
      <form onSubmit={addContact}>
         <div>
            Name: <input value={newName} onChange={handleNameChange}/>
         </div>
         <div>
            Number: <input value={newNumber} onChange={handleNumberChange}/>
         </div>
         <div>
            <button type="submit">save</button>
         </div>
      </form>
   )
}

export default PersonForm