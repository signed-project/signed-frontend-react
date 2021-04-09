


export class Post {
    constructor(data) {
        this.data = {
            source: data.source,
            id: data.id,
            type: data.type,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
            text: data.text,
            attachments: data.attachments,
            "target": {
                "sourceHash": "",
                "postHash": ""
            },
            signatures: data.signatures,
            likesCount: data.likesCount,
            repostsCount: data.repostsCount,
            commentsCount: data.commentsCount,
            reportsCount: data.reportsCount,
            hash: data.hash
        }
    }



    get newPost() {

        return {
            source: this.data.source,
            type: this.data.type,
            createdAt: new Date.getTime(),
        }
    }

}