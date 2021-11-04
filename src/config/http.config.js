import hostApiConfig from "../hostApiConfig.json";

export const postApi = {
  SEND_POST: "/post",
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
  API_HOST_ASSETS: hostApiConfig.API_HOST_ASSETS,
  API_HOST: hostApiConfig.API_HOST,
  API_TAG_HOST: hostApiConfig.API_TAG_HOST,
  PUBLIC_API_INDEX_HOST: hostApiConfig.PUBLIC_API_INDEX_HOST,
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
