import axios from 'axios';

//baseURL: 'http://localhost:3030/'
//baseURL: 'https://tocs77.ru/'
const instance = axios.create({
  baseURL: 'https://tocs77.ru/gunttapi/',
});

export default instance;
