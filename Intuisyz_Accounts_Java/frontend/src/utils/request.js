import axios from 'axios';
import baseUrl from '../Base Url/baseUrl';

const instance = axios.create();

const request = (method, url, data, baseHost = '') =>
  new Promise((resolve, reject) => {
    instance.defaults.baseURL = baseHost || baseUrl.url;
    (() => {
      if (method === 'get') {
        return instance.request({
          url,
          method,
          params: data,
        });
      }
      return instance.request({
        url,
        method,
        data,
      });
    })()
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        const { data: error } = err.response || {};
        reject(error);
      });
  });

export const Request = {
  get: (endpoint, data, baseHost) => request('get', endpoint, data, baseHost),
  post: (endpoint, data) => request('post', endpoint, data),
  put: (endpoint, data) => request('put', endpoint, data),
  del: (endpoint, data) => request('delete', endpoint, data),
  patch: (endpoint, data) => request('patch', endpoint, data),
};
