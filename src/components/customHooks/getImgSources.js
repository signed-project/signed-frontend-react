import mime from "mime/lite";
import { filesApi } from "../../config/http.config";




/**
 *  example how build path to img
 * split on two folder their name build from first letter and hash without first four letter  
 * img name : B2QMKmgv52q2YwpoYRrC1vmc92mxtbXcesm6f1megUCX.jpeg
 * path to img : B2/QM/Kmgv52q2YwpoYRrC1vmc92mxtbXcesm6f1megUCX.jpeg
 */
export const getFoldersName = ({ hash }) => {
  if (!hash) {
    return {}
  }
  return {
    first: hash.slice(0, 2),
    second: hash.slice(2, 4),
    fileName: hash.slice(4),
  };
};

const getImgArr = (arrImg) => {
  return arrImg.map((file) => {
    const fileExtension = mime.getExtension(file.contentType);
    // const fileName = file.hash + "." + fileExtension;
    const fileObj = getFoldersName({ hash: file.hash })
    return {
      ...file,
      imagePreviewUrl: `${filesApi.GET_FILE_PATH}${fileObj.first}/${fileObj.second}/${fileObj.fileName}.${fileExtension}`,
    };
  });
};

export default getImgArr;
