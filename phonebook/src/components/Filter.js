

const Filter = (props) => {
    return (
        <div>filter shown with a <input value={props.filter} onChange={props.handleFilterChange}/></div>
    )
}
export default Filter;