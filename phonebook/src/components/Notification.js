

const Notification = ({ message, isError }) => {
    if (message === null) {
        return null
    }
    console.log("Notification isError", isError)
    return (
        <div className={isError ? 'error' : 'success'}>
            {message}
        </div>
    )
}
export default Notification;