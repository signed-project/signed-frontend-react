import mime from "mime/lite";
import { filesApi } from "../../config/http.config";

/**
 *  example how build path to img
 * split on two folder their name build from first letter and hash without first four letter  
 * img name : B2QMKmgv52q2YwpoYRrC1vmc92mxtbXcesm6f1megUCX.jpeg
 * path to img : B2/QM/Kmgv52q2YwpoYRrC1vmc92mxtbXcesm6f1megUCX.jpeg
 */


export const getFilePath = ({ hash, fileExtension, contentType }) => {
  if (!hash) {
    return {}
  }
  if (contentType) {
    fileExtension = mime.getExtension(contentType);
  }
  const pathStructure = {
    first: hash.slice(0, 2),
    second: hash.slice(2, 4),
    fileName: hash.slice(4),
  };
  return `${filesApi.GET_FILE_PATH}${pathStructure.first}/${pathStructure.second}/${pathStructure.fileName}.${fileExtension}`
};


const getImgArr = (arrImg) => {
  if (!Array.isArray(arrImg)) {
    return []
  }
  return arrImg.map((file) => {
    const fileExtension = mime.getExtension(file.contentType);
    const imagePreviewUrl = getFilePath({ hash: file.hash, fileExtension })
    return {
      ...file,
      imagePreviewUrl: imagePreviewUrl
    };
  });
};

export default getImgArr;
