import { getSignatures, getHash } from '../../libs/signature';
export class User {
    constructor(data) {
        this.data = {
            isAuth: data.isAuth ? data.isAuth : false,
            wif: data.wif ? data.wif : '',
            subscribed: data.subscribed ? data.subscribed : [],
            source: {
                address: data.address ? data.address : '',
                name: data.name ? data.name : "",
                avatar: data.avatar ? data.avatar : {
                    contentType: "image/jpeg",
                    hash: "f433c21fe3c6c7475f7be0017294547e93d7fcd44617f62bf7f369a13b48e764"
                },
                publicName: data.publicName ? data.publicName : '',
                hosts: data.hosts ? data.hosts : [],
                signatures: data.signatures ? data.signatures : '',
                hash: data.hash ? data.hash : '',
            }
        };
    };

    set setUserData(data) {
        this.data = {
            isAuth: data.isAuth ? data.isAuth : false,
            wif: data.wif ? data.wif : '',
            subscribed: data.subscribed ? data.subscribed : [],
            source: {
                address: data.source.address ? data.address : '',
                name: data.source.name ? data.source.name : "",
                avatar: data.source.avatar ? data.source.avatar : {
                    contentType: "",
                    hash: ""
                },
                publicName: data.source.publicName ? data.source.publicName : '',
                hosts: data.source.hosts ? data.source.hosts : [],
            }
        };
    }

    get newUser() {
        const date = new Date().getTime();
        const source = {
            ...this.data.source,
            updatedAt: date,
        };
        const signatures = getSignatures({ data: source, wif: this.data.wif });
        const hash = getHash({ data: source });
        return {
            ...this.data,
            source: {
                ...source,
                signatures,
                hash
            }
        };
    }
}
