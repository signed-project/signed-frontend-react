import { getSignatures, getHash } from "../../libs/signature";
export class User {
  constructor(data) {
    this.data = {
      isAuth: data.isAuth ? data.isAuth : false,
      wif: data.wif ? data.wif : "",
      subscribed: data.subscribed ? data.subscribed : [],
      source: {
        address: data.address ? data.address : "",
        name: data.name ? data.name : "",
        avatar: data.avatar ? data.avatar : "",
        publicName: data.publicName ? data.publicName : "",
        hosts: data.hosts ? data.hosts : [],
        signatures: data.signatures ? data.signatures : "",
        hash: data.hash ? data.hash : "",
      },
    };
  }

  set setUserData(data) {
    this.data = {
      isAuth: data.isAuth ? data.isAuth : false,
      wif: data.wif ? data.wif : "",
      subscribed: data.subscribed ? data.subscribed : [],
      source: {
        address: data.source.address ? data.source.address : "",
        updatedAt: data.source.updatedAt ? data.source.updatedAt : "",
        name: data.source.name ? data.source.name : "",
        avatar: data.source.avatar
          ? data.source.avatar
          : {
              contentType: "",
              hash: "",
            },
        publicName: data.source.publicName ? data.source.publicName : "",
        hosts: data.source.hosts ? data.source.hosts : [],
        signatures: data.source.signatures ? data.source.signatures : "",
        hash: data.source.hash ? data.source.hash : "",
      },
    };
  }

  get newUser() {
    const date = this.data.source.updatedAt
      ? this.data.source.updatedAt
      : new Date().getTime();
    const source = {
      ...this.data.source,
      updatedAt: date,
    };

    const signatures = this.data.source.signatures
      ? this.data.source.signatures
      : getSignatures({ data: source, wif: this.data.wif });
    const hash = this.data.source.hash
      ? this.data.source.hash
      : getHash({ data: source });

    return {
      ...this.data,
      source: {
        ...source,
        signatures,
        hash,
      },
    };
  }
}
