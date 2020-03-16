import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function currentUser() {
  return request('/api/v3/user');
}

export async function tariff(payload) {
  return request(`https://testapi.moovlee.com/tariff/getAllDetails?id=${payload.vendorId}`, {
    method:"GET",
    headers:{
      'Authorization':`bearer ${localStorage.getItem('antd-pro-authority')}`
    }
  });
}

export async function edittariff(payload) {
  return request(`https://testapi.moovlee.com/tariff/add`, {
    method:"POST",
    headers:{
      'Content-Type': 'application/json',
      'Authorization':`bearer ${localStorage.getItem('antd-pro-authority')}`
    },
    body: JSON.stringify(payload),
  });
}

export async function customerledger(payload) {
  const id = payload.payload.id;
  return request(`/api/v3/customer/${id}/transactions`);
}
export async function customerProfile(payload) {
  const id = payload.payload.id;
  return request(`/api/v3/customer/view/${id}`);
}
export async function addCustomer(payload) {
  return request('/api/v3/user/appuser/add', {
    method: 'PUT',
    data: JSON.stringify(payload.payload),
  });
}
export async function addPO(payload) {
  const id = payload.payload.id;
  return request(`/api/v3/orders/${id}/update/po`, {
    method: 'PUT',
    data: JSON.stringify(payload.payload),
  });
}
export async function addDepartment(payload) {
  const id = payload.payload.id;
  console.log(id);
  return request(`/api/v3/orders/${id}/update/department`, {
    method: 'PUT',
    data: JSON.stringify(payload.payload),
  });
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function fetchcustomers() {
  return request('/api/v3/customers');
}

export async function customerlist() {
  return request('/api/v3/user/appusers');
}
export async function recentinvoices() {
  return request('/api/v3/recentinvoices');
}

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    data: {
      params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateRule(params = {}) {
  return request(`/api/rule?${stringify(params.query)}`, {
    method: 'POST',
    data: {
      ...params.body,
      method: 'update',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    data: params,
  });
}

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile(id) {
  return request(`/api/profile/basic?id=${id}`);
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

export async function removeFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    data: {
      ...restParams,
      method: 'delete',
    },
  });
}

export async function addFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    data: {
      ...restParams,
      method: 'post',
    },
  });
}

export async function updateFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    data: {
      ...restParams,
      method: 'update',
    },
  });
}

export async function fakeAccountLogin(params) {
  return request('/api/login/account', {
    method: 'POST',
    data: params,
  });
}

export async function userAccountLogin(params) {
  // const params = {"email":"balaji.p@pravertech.com","password":"test@123"}
  return request('https://testapi.moovlee.com/vendor/signin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });
  // return request('/api/login/account', {
  //   method: 'POST',
  //   data: params,
  // });
}

export async function fakeRegister(params) {
  return request('/api/register', {
    method: 'POST',
    data: params,
  });
}

export async function queryNotices(params = {}) {
  return request(`/api/notices?${stringify(params)}`);
}

export async function getFakeCaptcha(mobile) {
  return request(`/api/captcha?mobile=${mobile}`);
}
