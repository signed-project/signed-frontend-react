import { generateId, getHash, getSignatures } from '../../libs/signature';



export class Post {
    constructor(data) {
        this.data = {
            source: data.source,
            id: data.id ? data.id : '',
            type: data.type,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
            text: data.text,
            attachments: data.attachments,
            target: data.target ? data.target : '',
            // target: {
            //     "sourceHash": "",
            //     "postHash": ""
            // },
            signatures: data.signatures ? data.signatures : data.signatures,
            likesCount: data.likesCount ? data.likesCount : 0,
            repostsCount: data.repostsCount ? data.repostsCount : 0,
            commentsCount: data.commentsCount ? data.commentsCount : 0,
            reportsCount: data.reportsCount ? data.reportsCount : 0,
            hash: data.hash ? data.hash : '',
            wfi: data.wfi
        }
    }





    get newPost() {
        const id = generateId();
        const date = new Date().getTime();

        const newPost = {
            source: this.data.source,
            id: id,
            type: 'post',
            createdAt: date,
            updatedAt: date,
            text: this.data.text ? this.data.text : '',
            attachments: this.data.attachments ? this.data.attachments : [],
            likesCount: 0,
            repostsCount: 0,
            commentsCount: 0,
            reportsCount: 0,
        };

        const hash = getHash(newPost);
        const signature = getSignatures(newPost, this.data.wfi);

        return {
            source: this.data.source,
            id: id,
            type: 'post',
            createdAt: date,
            updatedAt: date,
            text: this.data.text ? this.data.text : '',
            attachments: this.data.attachments ? this.data.attachments : [],
            likesCount: 0,
            repostsCount: 0,
            commentsCount: 0,
            reportsCount: 0,
            signatures: signature,
            hash: hash
        }
    }

}