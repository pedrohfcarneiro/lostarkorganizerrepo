import axios from 'axios'

const baseUrl = 'http://localhost:3001/characters'

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
  }
  
  const createCharacter = newObject => {
    const request = axios.post(baseUrl, newObject)
    return request.then(response => response.data)
  }
  
  const updateCharacter = (id, newObject) => {
    const request = axios.put(`${baseUrl}/${id}`, newObject)
    return request.then(response => response.data)
  }
  
  const deleteCharacter = (id) => {
      const request = axios.delete(`${baseUrl}/${id}`)
      return request
  }
  
  export default { getAll,createCharacter,updateCharacter, deleteCharacter}