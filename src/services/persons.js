import axios from 'axios'
const baseUrl = 'https://fso-part3-gzzr.onrender.com/api/persons'

const getAll = () => {
  return axios.get(baseUrl)
}

const create = newObject => {
  return axios.post(baseUrl, newObject)
}

const update = (id, newObject) => {
  return axios.put(`${baseUrl}/${id}`, newObject)
}

const delPers = (id) => {
    return axios.delete(`${baseUrl}/${id}`)
}

export default { getAll, create, update , delPers}