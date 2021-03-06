import mime from "mime/lite";
import { filesApi, hostApi } from "../../config/http.config";

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
  // TODO This should be source.host.assets instead of filesApi.GET_FILE_PATH
  return `${hostApi.API_HOST_ASSETS}${pathStructure.first}/${pathStructure.second}/${pathStructure.fileName}.${fileExtension}`
};


const getImgArr = (arrImg) => {
  if (!Array.isArray(arrImg)) {
    return []
  }
  return arrImg.map((file) => {
    const fileExtension = mime.getExtension(file.contentType);
    let imagePreviewUrl = getFilePath({ hash: file.hash, fileExtension });
    if (file.url) {
      imagePreviewUrl = file.url
    }
    return {
      ...file,
      imagePreviewUrl: imagePreviewUrl
    };
  });
};

export default getImgArr;
