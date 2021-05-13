import mime from 'mime/lite';
import { filesApi } from '../../config/http.config';

const getImgArr = (arrImg) => {
    return arrImg.map(file => {
        console.log('file________', file);
        const fileExtension = mime.getExtension(file.contentType);
        console.log('%%%%%%fileExtension%%%%%%%', fileExtension);

        const fileName = file.hash + '.' + fileExtension;
        return ({ imagePreviewUrl: filesApi.GET_FILE_PATH + fileName })
    })
};

export default getImgArr;