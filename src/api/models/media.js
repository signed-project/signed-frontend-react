export class Media {
  constructor(data) {
    this.data = {
      contentType: data.contentType ? data.contentType : "",
      hash: data.hash ? data.hash : "",
      width: data.width ? data.width : "",
      height: data.height ? data.height : "",
      thumbnail: data.thumbnail ? data.thumbnail : "",
    };
  }
  get newMedia() {
    const media = {
      hash: this.data.hash,
      contentType: this.data.contentType ? this.data.contentType : "",
      width: this.data.width,
      height: this.data.height,
      thumbnail: this.data.thumbnail,
    };
    // TODO find out hash or id
    // const hash = getHash(media);

    return {
      ...media,
    };
  }
}
