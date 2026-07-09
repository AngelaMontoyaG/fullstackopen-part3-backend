import Contact from './Contact'

const Persons = ({ contacts, deleteContact }) => {
   return (
      <>
         {contacts.map((contact) => (
            <Contact key={contact.id} contact={contact} deleteContact={() => deleteContact(contact.id)} />
         ))}
      </>
   )
}

export default Persons