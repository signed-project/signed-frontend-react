import mime from "mime/lite";
import { filesApi } from "../../config/http.config";




/**
 *  example how build path to img
 * split on two folder their name build from first letter and hash without first four letter  
 * img name : B2QMKmgv52q2YwpoYRrC1vmc92mxtbXcesm6f1megUCX.jpeg
 * path to img : B2/QM/Kmgv52q2YwpoYRrC1vmc92mxtbXcesm6f1megUCX.jpeg
 */
// export const getFoldersName = ({ hash, fileExtension }) => {
export const getFilePath = ({ hash, fileExtension }) => {
  if (!hash) {
    return {}
  }

  const pathStructure = {
    first: hash.slice(0, 2),
    second: hash.slice(2, 4),
    fileName: hash.slice(4),
  };
  return `${filesApi.GET_FILE_PATH}${pathStructure.first}/${pathStructure.second}/${pathStructure.fileName}.${fileExtension}`
};


const getImgArr = (arrImg) => {
  return arrImg.map((file) => {
    const fileExtension = mime.getExtension(file.contentType);
    // const fileName = file.hash + "." + fileExtension;
    const imagePreviewUrl = getFilePath({ hash: file.hash, fileExtension })
    return {
      ...file,
      imagePreviewUrl: imagePreviewUrl
    };
  });
};

export default getImgArr;
