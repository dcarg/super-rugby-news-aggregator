import Axios from 'axios'

const axios = Axios.create({
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

const api = (url, params = {}, config = { method: 'GET' }) => {
  
  return axios({
    config,
    params,
    url,
  })
}

export default api
