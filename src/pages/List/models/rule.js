import {
  queryRule,
  removeRule,
  addRule,
  updateRule,
  tariff,
  edittariff,
  customerlist,
  currentUser,
  addCustomer,
  recentinvoices,
  addDepartment,
  addPO,
  fetchcustomers,
  customerledger,
  customerProfile,
} from '@/services/api';

export default {
  namespace: 'rule',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    tariffList:[],
    appusers: [],
    formSubmit:"",
    user: [],
    appuser: [],
    recentInvoices: [],
    po: {},
    department: {},
    customers: [],
    customerLedger: [],
    customerProfile: [],
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(customerlist);
      yield put({
        type: 'saveusers',
        payload: response,
      });
    },
    *tariff({ payload }, { call, put }) {
      const response = yield call(tariff, payload);
      yield put({
        type: 'savetariffList',
        payload: Array.isArray(response) ? response : [],
      });
    },
    *editTariff({ payload }, { call, put }) {
      const response = yield call(edittariff, payload);
      // console.log(response)
      yield put({
        type: 'savetariffListSuccess',
        payload: response ? "success": "failure",
      });
    },
    *closeSuccessPop({}, { put }) {
      yield put({
        type: 'savetariffListSuccess',
        payload: "failure",
      });
    },
    
    *fetchUser(_, { call, put }) {
      const response = yield call(currentUser);
      yield put({
        type: 'saveuser',
        payload: response,
      });
    },
    *fetchInvoices(_, { call, put }) {
      const response = yield call(recentinvoices);
      yield put({
        type: 'saveinvoices',
        payload: response,
      });
    },
    *fetchCustomers(_, { call, put }) {
      const response = yield call(fetchcustomers);
      yield put({
        type: 'savecustomers',
        payload: response,
      });
    },
    *fetchcustomerProfile(payload, { call, put }) {
      const response = yield call(customerProfile, payload);
      yield put({
        type: 'savecustProfile',
        payload: response,
      });
    },
    *custLedger(payload, { call, put }) {
      const response = yield call(customerledger, payload);
      yield put({
        type: 'savecustomerledger',
        payload: response,
      });
    },
    // *fetch({ payload }, { call, put }) {
    //   const response = yield call(queryRule, payload);
    //   yield put({
    //     type: 'save',
    //     payload: response,
    //   });
    // },
    // *add({ payload, callback }, { call, put }) {
    //   const response = yield call(addRule, payload);
    //   yield put({
    //     type: 'save',
    //     payload: response,
    //   });
    //   if (callback) callback();
    // },

    *add(payload, { call, put }) {
      const response = yield call(addCustomer, payload);
      yield put({
        type: 'addcustomer',
        payload: response,
      });
    },
    *addPO(payload, { call, put }) {
      const response = yield call(addPO, payload);
      yield put({
        type: 'savePO',
        payload: response,
      });
    },
    *addDepartment(payload, { call, put }) {
      const response = yield call(addDepartment, payload);
      yield put({
        type: 'saveDept',
        payload: response,
      });
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removeRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(updateRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    savetariffList(state, action) {
      return {
        ...state,
        tariffList: action.payload,
      };
    },
    savetariffListSuccess(state, action) {
      return {
        ...state,
        formSubmit: action.payload,
      };
    },
    saveusers(state, action) {
      return {
        ...state,
        appusers: action.payload,
      };
    },
    saveuser(state, action) {
      if (action.payload.type && action.payload.type !== 'Corporate') {
        window.location.href = '/';
      }
      return {
        ...state,
        user: action.payload,
      };
    },
    saveinvoices(state, action) {
      return {
        ...state,
        recentInvoices: action.payload,
      };
    },
    savecustomerledger(state, action) {
      return {
        ...state,
        customerLedger: action.payload,
      };
    },
    savecustProfile(state, action) {
      return {
        ...state,
        customerProfile: action.payload,
      };
    },
    addcustomer(state, action) {
      return {
        ...state,
        appuser: action.payload,
      };
    },
    savePO(state, action) {
      return {
        ...state,
        po: action.payload,
      };
    },
    saveDept(state, action) {
      return {
        ...state,
        department: action.payload,
      };
    },
    savecustomers(state, action) {
      return {
        ...state,
        customers: action.payload,
      };
    },
  },
};
