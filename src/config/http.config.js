export default {
  base: '/api/v1', // base url path for whole app
  models: {
    user: {
      base: '/user',
      paths: {
        getUser: '/',
        register: '/register',
        login: '/login',
      },
    },
    data: {
      base: '/data',
      paths: {
        data: '/',
        list: '/list',
      },
    },
    socket: {
      base: '/socket',
    },
  },
};
