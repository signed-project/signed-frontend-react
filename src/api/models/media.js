import mime from 'mime/lite';
import { generateId, getHash, getSignatures } from '../../libs/signature';

export class Media {
    constructor(data) {
        this.data = {
            contentType: data.type ? data.type : '',
            hash: data.hash ? data.hash : '',
            width: data.width ? data.width : '',
            height: data.height ? data.height : '',
            thumbnail: data.thumbnail ? data.thumbnail : '',
        }
    }
    get newMedia() {

        console.log(' this.data.contentType^^^^^^^^^^^^^[media]', this.data.contentType);
        console.log(' mime^^^^^^^^^^^^^[media]', mime.getType(this.data.contentType));

        const media = {
            hash: this.data.hash,
            contentType: this.data.contentType ? mime.getType(this.data.contentType) : '',
            width: this.data.width,
            height: this.data.height,
            thumbnail: this.data.thumbnail,
        };
        // TODO find out hash or id
        // const hash = getHash(media);


        return {
            ...media,
        }
    }


}