export default class Board {
  constructor(container) {
    this.container = container;
  }

  static get markup() {
    return `
    <div class="chat-container">
      <section class="users-box">
        <ul class="users-list"></ul>
        <button class="exit__btn">Exit</button>
      </section>
      <section class="messages-box">
        <ul class="messages-list"></ul>
        <div class="new-message__box">
          <div class="input__wrapper">
            <input class="input__message" type="text" placeholder="Введите текст...">
            <span class="tooltip-active hidden"></span>
          </div>
          <button class="add__message"></button>
        </div>
      </section>
    </div>
`;
  }

  bindToDOM() {
    this.container.insertAdjacentHTML("afterbegin", this.constructor.markup);
  }
}
