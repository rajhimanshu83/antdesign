import { query as queryUsers, queryCurrent } from '@/services/user';
import { getToken } from '@/utils/authority';
import { routerRedux } from 'dva/router';

export default {
  namespace: 'user',

  state: {
    list: [],
    currentUser: {},
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      console.log(getToken())
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
      if (!getToken()) {
        yield put(routerRedux.replace(redirect || '/user/login'));
      }
    },
    *isLoggedIn(_, { call, put }) {
      // getToken();
      console.log("dsfsfs")
      // yield put({
      //   type: 'saveCurrentUser',
      //   payload: response,
      // });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
  },
};
