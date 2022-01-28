export default class Post {
  constructor(data, name, write = "") {
    this.data = data;
    this.name = name;
    this.write = write;
  }

  init() {
    this.bindToDOM();
  }

  static template(data, name, write) {
    return `
      <li class="posts__card" data-id="${data.id}" data-time="${data.created}" data-author="${data.author}">
        <div class="post__wrapper  ${write}">
          <div class="post__header">
            <span class="posts__author">${name}, </span>
            <span class="posts__datetime">${data.created}</span>
          </div>
          <div class="post__content">${data.message}</div>
        </div>
      </li>
      `;
  }

  bindToDOM() {
    const panel = document.querySelector(".messages-list");

    const post = this.addPost(this.data, this.name, this.write);

    panel.insertAdjacentHTML("beforeend", post);
  }

  addPost() {
    if (this.data) {
      const result = this.constructor.template(
        this.data,
        this.name,
        this.write
      );

      return result;
    }
    return false;
  }
}
