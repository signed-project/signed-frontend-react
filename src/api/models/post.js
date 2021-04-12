import CryptoAES from 'crypto-js/aes';
import stringify from 'fast-json-stable-stringify';
import { object } from 'joi';
import sortKeys from 'sort-keys';
import { nanoid } from 'nanoid';
import { useSelect } from 'react-redux';
// import sha256 from 'crypto-js/sha256';
import CryptoJS from 'crypto-js';
import { add } from 'date-fns';
import bs58 from 'bs58';
import * as   bitcoin from 'bitcoinjs-lib';
import * as   bitcoinMessage from 'bitcoinjs-message';


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

    getJsonStringFromObj(postObj) {
        let postCopy = JSON.parse(JSON.stringify(postObj));
        if (postCopy.hash || postCopy.signatures) {
            delete postCopy.hash;
            delete postCopy.signatures;
        }
        postCopy = sortKeys(postCopy);
        return stringify(postCopy);
    }

    getSignatures(post) {
        const postJson = this.getJsonStringFromObj(post);
        const keyPair = bitcoin.ECPair.fromWIF(this.data.wfi);
        const privateKey = keyPair.privateKey;
        let signature = bitcoinMessage.sign(postJson, privateKey, keyPair.compressed);
        const signatureNext = signature.toString('hex');
        console.log('(((((((((((((((((((((((((signature))))))))))))))))))))))', signatureNext);
        const bytes = Buffer.from(signature, 'hex')
        const address = bs58.encode(bytes)
        return address;
        return signature.toString('base64')
    }


    getHash(post) {
        const postJson = this.getJsonStringFromObj(post);
        let hash = CryptoJS.SHA256(postJson)
        hash = hash.toString(CryptoJS.enc.Hex);
        const bytes = Buffer.from(hash, 'hex')
        const address = bs58.encode(bytes)
        return address;
    }

    generateId() {
        return nanoid();
    }


    get newPost() {

        const id = this.generateId();
        const date = new Date().getTime();



        const newPost = {
            source: this.data.source,
            id: id,
            type: 'post',
            createdAt: date,
            updatedAt: date,
            text: this.data.text ? this.data.text : '',
            attachments: this.data.attachments ? this.data.attachments : [],
            // TODO: 
            // target: this.data.target,
            likesCount: 0,
            repostsCount: 0,
            commentsCount: 0,
            reportsCount: 0,
        };

        const hash = this.getHash(newPost);
        const signature = this.getSignatures(newPost);


        console.log('hash', hash);
        // console.log('signatures', signatures);
        return {
            source: this.data.source,
            id: this.generateId(),
            type: 'post',
            createdAt: date,
            updatedAt: date,
            text: this.data.text ? this.data.text : '',
            attachments: this.data.attachments ? this.data.attachments : '',
            // TODO: 
            // target: this.data.target,
            signatures: signature,
            likesCount: 0,
            repostsCount: 0,
            commentsCount: 0,
            reportsCount: 0,
            hash: hash
        }
    }

}