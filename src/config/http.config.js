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
  GET_FILE_PATH: "http://localhost:4000/static/",
};
