import request from '@/utils/request';

export async function query() {
  return request('/api/users');
}

export async function queryCurrent() {
  // return request('/api/v3/vendor/signin');
  const params = {"email":"balaji.p@pravertech.com","password":"test@123"}
  return request('https://testapi.moovlee.com/vendor/signin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });
}

// export async function querySignin() {
//   return request('/api/v3/vendor/signin');
// }

export async function logout() {
  return request('/api/v3/logout');
}
