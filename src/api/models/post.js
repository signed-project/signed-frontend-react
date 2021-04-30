import { generateId, getHash, getSignatures } from '../../libs/signature';



export class Post {
    constructor(data) {
        this.data = {
            source: data.source,
            id: data.id ? data.id : '',
            type: data.type,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
            text: data.text ? data.text : '',
            attachments: data.attachments ? data.attachments : [],
            target: data.target ? data.target : '',
            signatures: data.signatures ? data.signatures : data.signatures,
            likesCount: data.likesCount ? data.likesCount : 0,
            repostsCount: data.repostsCount ? data.repostsCount : 0,
            commentsCount: data.commentsCount ? data.commentsCount : 0,
            mentions: data.mentions ? data.mentions : '',
            hash: data.hash ? data.hash : '',
            wfi: data.wfi
        }
    }


    get newPost() {
        const id = generateId();
        const date = new Date().getTime();

        const post = {
            source: this.data.source,
            id: id,
            type: this.data.type,
            createdAt: date,
            updatedAt: date,
            text: this.data.text,
            attachments: this.data.attachments,
            target: this.data.target,
            likesCount: this.data.likesCount,
            repostsCount: this.data.repostsCount,
            commentsCount: this.data.commentsCount,
            mentions: this.data.mentions,
        };

        const hash = getHash(post);
        const signature = getSignatures(post, this.data.wfi);

        return {
            ...post,
            signatures: signature,
            hash: hash
        }
    }


}