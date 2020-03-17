import request from '@/utils/request';

export async function query() {
  return request('/api/users');
}

export async function queryCurrent() {
  // return request('/api/v3/vendor/signin');
  return request(`https://testapi.moovlee.com/vendor/account`, {
    method:"GET",
    headers:{
      'Authorization':`bearer ${localStorage.getItem('antd-pro-authority')}`
    }
  });
}

// export async function querySignin() {
//   return request('/api/v3/vendor/signin');
// }

export async function logout() {
  return request('/api/v3/logout');
}
