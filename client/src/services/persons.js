import axios from 'axios'
const baseUrl = 'http://localhost:3001/api/persons'

const getAll = () => {
    const req = axios.get(baseUrl)
    return req.then(response => {
        // console.log("getAll", response.data)
        return response.data
    })
}

const create = newObject => {
    const req = axios.post(baseUrl, newObject)
    return req.then(response => response.data)
}

const update = (id, newObject) => {
    const req = axios.put(`${baseUrl}/${id}`, newObject)
    return req.then(response => response.data)
}

const deletePerson = (id) => {
    const req = axios.delete(`${baseUrl}/${id}`, id)
    return req.then(response => response.data)
}

export default { getAll, create, update, deletePerson }