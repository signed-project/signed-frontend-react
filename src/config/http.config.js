// TODO : HTTP class
// export default {
//   models: {
//     posts: {
//       base: '/post',
//       paths: {
//         sendPost: '/',
//       },
//     },
//   },
// };

export const bookApi = {
  SEND_POST: "/post",
  GET_BOOK: "/book",
};


export const filesApi = {
  UPLOAD_FILE: "/files/upload",
  DELETE_FILE: "/files/delete",
  DOWNLOAD_FILE: (fileId) => `/files/${fileId}/download`,
  DOWNLOAD_ARCHIVE: "/files/archive",
  FILES_LIST: "/files/list",
  FILES_TYPE: "/files/types",
  FILE_SIGNATURE: "/files/signatures",
};