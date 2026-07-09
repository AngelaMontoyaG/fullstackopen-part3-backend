import Contact from './Contact'

const Filter = ({ searchTerm, handleFilterChange, contactsToShow, deleteContact}) => {
   return (
      <>
         Filter shown with <input value={searchTerm} onChange={handleFilterChange}/>
         {searchTerm && (
            <div>
               <h3>Search Results</h3>
               {contactsToShow.length === 0 ? (
                  <p>No contacts match your search</p>
               ) : (
                  contactsToShow.map((contact) => (
                     <Contact key={`search-${contact.id}`} contact={contact} deleteContact={deleteContact}/>
                  ))
               )}
            </div>
         )}
      </>
   )
}

export default Filter