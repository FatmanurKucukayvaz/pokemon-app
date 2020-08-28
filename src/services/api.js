import axios from 'axios';

class BaseService {
  constructor() {

    this.baseUrl = "https://pokeapi.co/api/v2/";

    axios.interceptors.request.use(function (config) {
      config.headers.common['x-access-token'] = localStorage.getItem('token');
      return config;
    }, function (error) {
      return Promise.reject(error);
    });

    axios.interceptors.response.use(function (response) {
      return response;
    }, function (error) {

      // response is undefined when a network error occurs
      if (error.response) {
        return Promise.reject(error.response.data);
      } else {
        let message = error.message;
        if (error.message === "Network Error") {
          message = "İşleminizi şu anda gerçekleştiremiyoruz, lütfen tekrar deneyiniz."
        }
        return Promise.reject({ message });
      }
    });
  }
  
  getData(path) {
    let url = `${this.baseUrl}${path}`;
    return axios.get(`${url}`);
  }
}

export default (new BaseService()); 