
export class User {
    constructor(data) {
        this.data = {
            isAuth: data.isAuth ? data.isAuth : false,
            wif: data.wif ? data.wif : '',
            subscribed: data.subscribed ? data.subscribed : [],
            source: {
                address: data.address ? data.address : "",
                name: data.name ? data.name : "",
                updatedAt: data.updatedAt ? data.updatedAt : "",
                avatar: {
                    contentType: "image/jpeg",
                    hash: "f433c21fe3c6c7475f7be0017294547e93d7fcd44617f62bf7f369a13b48e764"
                },
                hosts: [{
                    fileStores: ['jdjjdj'],
                    index: "url"
                }],
                signatures: 'fjdjd343243jkdfjdk343',
                hash: 'fjdjd343243jkdfjdk343',
            }
        };
    }

    get newUser() {
        const date = new Date().getTime();
        const source = this.data.source;
        return {
            ...this.data,
            source: {
                ...source,
                updatedAt: date
            }
        };
    }
}
