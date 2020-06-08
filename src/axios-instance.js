import axios from 'axios';

//baseURL: "http://localhost:3030/"
//baseURL: "http://45.143.137.231/"
const instance = axios.create({
    baseURL: "http://45.143.137.231/"
})

export default instance;