export const postApi = {
  SEND_POST: "/post",
};
export const publicApi = {
  HOST_ASSETS: "/public/file_storage",
};

export const filesApi = {
  UPLOAD_FILE: "/file/upload",
  DELETE_FILE: "/file/delete",
  DOWNLOAD_FILE: (fileId) => `/file/${fileId}/download`,
  DOWNLOAD_ARCHIVE: "/files/archive",
  FILES_LIST: "/files/list",
  FILES_TYPE: "/files/types",
  FILE_SIGNATURE: "/files/signatures",
};

export const hostApi = {
  API_HOST_ASSETS: `https://kuku-staging.s3-us-west-2.amazonaws.com/public/file_storage`,
  API_HOST: `https://2poeme803i.execute-api.us-west-2.amazonaws.com`,
  API_TAG_HOST: `https://uljlagwuji.execute-api.us-west-2.amazonaws.com/prod`,
  PUBLIC_API_INDEX_HOST: `https://ph04gkkcyd.execute-api.us-west-2.amazonaws.com/prod`,
};

export const userApi = {
  REGISTER: "/register",
  CHECK_LOGIN: "/register/checkLogin",
  LOGIN_EXCHANGE_EPHEMERAL_KEYS: "/login/exchangeEphemeralKeys",
  LOGIN_SESSION_PROOF: "/login/validateSessionProofs",
  LOGIN_GET_USER_TOKEN: "/login/getUserToken",
  GET_USER: "/user",
  GET_TOKEN_PAIR: "/tokens-pair",
  SUBSCRIBED: "/subscribed",
  UPDATE_USER: "/user/update",
  FOLLOW_USER: "/user/follow",
};

export const inboxApi = {
  INBOX: "/inbox",
  INBOX_UPDATE_STATE: "/inbox/update",
};

// 24, 36, 72
export const robotHash = ({ hash, size }) => {
  return `https://robohash.org/${hash}.png`;
};

// url: 'https://robohash.org/asfdsdf.png?size=200x200',

// inbox statuses new/rejected/accepted
