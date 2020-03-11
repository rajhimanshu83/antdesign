export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', name: 'login', component: './User/Login' },
      { path: '/user/register', name: 'register', component: './User/Register' },
      {
        path: '/user/register-result',
        name: 'register.result',
        component: './User/RegisterResult',
      },
      {
        component: '404',
      },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    // Routes: ['src/pages/Authorized'],
    routes: [
      // dashboard
      { path: '/', redirect: '/list', authority: ['admin', 'user'] },
      {
        path: '/list',
        icon: 'user',
        name: 'App Users',
        component: './List/BasicList',
      },
      {
        path: '/recentinvoices',
        icon: 'paper-clip',
        name: 'Recent Invoices',
        component: './List/RecentInvoices',
      },
      {
        path: '/customers',
        icon: 'table',
        name: 'Clients',
        component: './List/customerlist',
      },
    ],
  },
];
