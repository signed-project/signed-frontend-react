export const postApi = {
  SEND_POST: "/post",
};
export const publicApi = {
  GET_INDEX: "/prod",
};

export const filesApi = {
  UPLOAD_FILE: "/file/upload",
  DELETE_FILE: "/file/delete",
  DOWNLOAD_FILE: (fileId) => `/file/${fileId}/download`,
  DOWNLOAD_ARCHIVE: "/files/archive",
  FILES_LIST: "/files/list",
  FILES_TYPE: "/files/types",
  FILE_SIGNATURE: "/files/signatures",
  GET_FILE_PATH: "http://localhost:4001/static/",
};

export const userApi = {
  REGISTER: '/register',
  IS_FREE_LOGIN: '/register/checkLogin',
  LOGIN: '/login/exchangeEphemeralKeys',
  LOGIN_SESSION_PROOF: '/login/validateSessionProofs',
  LOGIN_GET_USER_TOKEN: '/login/getUserToken',
  GET_USER_BY_TOKEN: '/user-by-token',
  GET_TOKEN_PAIR: '/tokens-pair',
};
