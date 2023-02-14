
const Person = (props) => {
    return (
        <div> 
            {props.person.name} 
            {props.person.number} 
            <button onClick={() => props.handleDelete(props.person.id)}>
                Delete
            </button>
        </div>
    )
}
export default Person