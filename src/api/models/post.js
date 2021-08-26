import { generateId, getHash, getSignatures } from '../../libs/signature';



export class Post {
    constructor(data) {
        this.data = {
            source: data.source,
            currentUserAddress: data.currentUserAddress ? data.currentUserAddress : '',
            id: data.id ? data.id : generateId(),
            type: data.type,
            createdAt: data.createdAt ? data.createdAt : 0,
            updatedAt: data.createdAt ? data.createdAt : 0,
            text: data.text ? data.text : '',
            attachments: data.attachments ? data.attachments : [],
            target: data.target ? data.target : '',
            signatures: data.signatures ? data.signatures : [],
            likesCount: data.likesCount ? data.likesCount : 0,
            repostsCount: data.repostsCount ? data.repostsCount : 0,
            commentsCount: data.commentsCount ? data.commentsCount : 0,
            mentions: data.mentions ? data.mentions : '',
            tags: data.tags ? data.tags : [],
            hash: data.hash ? data.hash : '',
            wif: data.wif
        }
    }


    get newPost() {
        const date = new Date().getTime();

        const post = {
            source: this.data.source,
            id: this.data.id,
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

        const hash = getHash({ data: post });
        const signature = getSignatures({ data: post, wif: this.data.wif });

        return {
            ...post,
            signatures: [{ signature, address: this.data.source.address }],
            hash: hash
        }
    }

    get addSignature() {
        const post = {
            source: this.data.source,
            id: this.data.id,
            type: this.data.type,
            createdAt: this.data.createdAt,
            updatedAt: this.data.updatedAt,
            text: this.data.text,
            attachments: this.data.attachments,
            target: this.data.target,
            likesCount: this.data.likesCount,
            repostsCount: this.data.repostsCount,
            commentsCount: this.data.commentsCount,
            mentions: this.data.mentions,
            hash: this.data.hash,
        };

        const newSignature = getSignatures({ data: post, wif: this.data.wif });
        const signatureItem = {
            signature: newSignature,
            address: this.data.currentUserAddress
        };
        if (Array.isArray(this.data.signatures)) {
            this.data.signatures.push(signatureItem)
        }
        console.log('this.data.signatures.push&&&&&&&&&&', this.data.signatures);
        return {
            ...post,
            signatures: this.data.signatures,
        }
    }
}