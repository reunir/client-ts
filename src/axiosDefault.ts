import axios from 'axios'
import { getUrl } from './utils'

const axiosExternal = axios.create({})

export function setAxiosDefault() {
    console.log('api url= ', getUrl())
    axios.defaults.baseURL = getUrl()
    axios.defaults.headers.common['Content-Type'] = 'application/json'
    axios.defaults.headers.common['Accept'] = 'application/json'
}

export function setToken(token: string) {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + token
}

export function getToken() {
    return axios.defaults.headers.common['Authorization']
}

export { axiosExternal }