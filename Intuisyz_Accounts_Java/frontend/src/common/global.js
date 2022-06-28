import { toast, ToastContainer } from 'react-toastify';

export const AxiosHeader = {
  headers: {
    Authorization: `Bearer `,
  },
};

export function showConsole(message, value) {
  console.log(message, value);
}
export function errorToast(message, route = '', history, time = 1500) {
  toast.error(message, {
    className: 'failure-toast',
    position: toast.POSITION.TOP_CENTER,
  });
  if (route !== '') {
    setTimeout(() => {
      history.push({
        pathname: '/' + route === '/' ? '' : route,
      });
    }, time);
  }
}
export function successToast(message, history, time = 2000) {
  toast.success(message, {
    className: 'success-toast',
    position: toast.POSITION.TOP_CENTER,
  });
}
