// If Message had any complex fields, we'd put them on this object.
module.exports = class Message {
  constructor(id, {content, author}) {
    this.id = id;
    this.content = content;
    this.author = author;
  }
}