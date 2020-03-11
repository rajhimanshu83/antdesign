import {
  queryRule,
  removeRule,
  addRule,
  updateRule,
  customerlist,
  currentUser,
  addCustomer,
} from '@/services/api';

export default {
  namespace: 'rule',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    appusers: [],
    user: [],
    appuser: [],
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(customerlist);
      yield put({
        type: 'saveusers',
        payload: response,
      });
    },
    *fetchUser(_, { call, put }) {
      const response = yield call(currentUser);
      yield put({
        type: 'saveuser',
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
      console.log(payload);
      yield put({
        type: 'addcustomer',
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
    saveusers(state, action) {
      return {
        ...state,
        appusers: action.payload,
      };
    },
    saveuser(state, action) {
      return {
        ...state,
        user: action.payload,
      };
    },
    addcustomer(state, action) {
      return {
        ...state,
        appuser: action.payload,
      };
    },
  },
};
