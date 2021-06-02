export const bookApi = {
  SEND_POST: "/post",
  GET_BOOK: "/book",
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
  LOGIN: '/login',
  LOGIN_SESSION_PROOF: '/login/session-proof',
  REGISTER: '/register',
  IS_FREE_LOGIN: '/isFreeLogin',
  GET_USER_BY_TOKEN: '/user-by-token',
  GET_USER: '/user',
  GET_TOKEN_PAIR: '/tokens-pair',
};
