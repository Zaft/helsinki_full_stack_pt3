import Person from "./Person"

const Persons = (props) => {
    return (
        props.peopleToShow.map(person => {
            return (
                <Person 
                    key={person.id} 
                    person={person} 
                    handleDelete={props.handleDelete}/>
            )
        })
    )
}
export default Persons;