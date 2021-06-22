import mime from "mime/lite";
import { filesApi } from "../../config/http.config";

const getImgArr = (arrImg) => {
  return arrImg.map((file) => {
    const fileExtension = mime.getExtension(file.contentType);

    const fileName = file.hash + "." + fileExtension;
    return {
      ...file,
      imagePreviewUrl: filesApi.GET_FILE_PATH + fileName,
    };
  });
};

export default getImgArr;
