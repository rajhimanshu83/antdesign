import request from '@/utils/request';

export async function query() {
  return request('/api/users');
}

export async function queryCurrent() {
  return request('/api/v3/user');
}

export async function logout() {
  return request('/api/v3/logout');
}
