// eslint-disable-next-line import/no-cycle
import Socket from "./API/Socket";
import AjaxManager from "./API/AjaxManager";
import Post from "./Post";
import Modal from "./Modal";

export default class Controller {
  constructor(board) {
    this.board = board;
    this.api = new AjaxManager();
  }

  init() {
    this.board.bindToDOM();
    this.container = document.querySelector("#container");
    this.modal = new Modal(this.container);
    this.modal.redrawModalForm();

    this.addSubscribe(this.container);
  }

  addSubscribe(element) {
    element.addEventListener("click", this.onClickRegister.bind(this));
    element.addEventListener("click", this.completionField.bind(this));
    element.addEventListener("input", this.completionField.bind(this));
    element.addEventListener("click", this.onClickAddMessage.bind(this));
    element.addEventListener("keyup", this.keyUp.bind(this));
    element.addEventListener("click", this.onClickExitBtn.bind(this));
  }

  /**
   * Берет имя пользователя из строки
   * отправляет данные на сервер и получает обратно список пользователей
   * В случае, если в списке уже есть такой пользователь,
   * показывает подсказку и сворачивается.
   * Если никнейм уникальный:
   *Закрывает модальное окно
   *Формирует нового пользователя и отрисовывает его
   *Создает подключение WS для обмена сообщениями
   * @returns
   */

  onClickRegister(e) {
    if (!e.target.classList.contains("modal-send__btn")) {
      return;
    }

    e.preventDefault();

    const username = document.querySelector(".input__username").value.trim();
    if (username === "") {
      this.showTooltip("*Заполните поле");
      return;
    }

    this.api.getStartedList((response) => {
      const index = this.getUserNameIdx(response, username);
      if (index !== -1) {
        this.showTooltip("*Этот никнейм уже занят");
      } else {
        document.querySelector(".tooltip-active").classList.add("hidden");
        this.modal.closeModalForm();
        response.forEach((elem) => {
          this.renderingAcc(elem, elem.name);
        });
        this.createUser(username);
        this.socket = new Socket(this.currentUser);
        this.socket.init();
      }
    });
  }

  getUserNameIdx(arr, name) {
    return arr.findIndex((elem) => elem.name === name);
  }

  /**
   * Создает нового участника
   * @returns
   */
  createUser(data) {
    this.api.createNewUser(data, (response) => {
      this.renderingAcc(response, `${response.name}(You)`);
      this.currentUser = response;

      const sendData = {
        type: "add",
        user: this.currentUser,
      };
      this.socket.sendMessage(sendData, this.currentUser.name);
    });
  }

  /**
   * отрисовывает список участников
   * @returns
   */
  renderingAcc(data, username) {
    const parent = document.querySelector(".users-list");
    parent.insertAdjacentHTML(
      "beforeend",
      this.constructor.getUserAccMarkup(data, username)
    );
  }

  static getUserAccMarkup(data, username) {
    return `
  <li class="user__card" data-id="${data.id}" data-status="${data.status}" data-username="${data.name}">
    <div class="card__content">
      <div class="avatar-wrapper"></div>
      <span class="username">${username}</span>
    </div>

  </li>
  `;
  }

  /**
   * Формирует данные для отправки сообщения на сервер
   * @returns
   */
  getMessage() {
    this.newMessage = document.querySelector(".input__message").value.trim();
    const data = {
      type: "message",
      author: this.currentUser.name,
      created: new Date().toLocaleString(),
      message: this.newMessage,
    };
    return data;
  }

  /**
   * отрисовывает новое сообщение.
   * В зависимости от автора и аккаунта,
   * где сообщение будет отображаться,
   * появляется указатель "You"
   * и выравниваются блоки сообщений
   * @returns
   */
  renderingPost(data, name) {
    data.author === name
      ? (this.post = new Post(data, "You", "my__notes"))
      : (this.post = new Post(data, data.author, ""));

    this.post.init();
    document.querySelector(".input__message").value = "";
  }

  /**
   * Показывает подсказку при пустых полях
   * @returns
   */
  showTooltip(text) {
    const tooltip = document.querySelector(".tooltip-active");
    tooltip.classList.remove("hidden");
    tooltip.textContent = text;
  }

  /**
   * заполнеие полей и удаление подсказок пр этом
   * @returns
   */
  completionField(e) {
    if (!e.target.classList.contains("input__message")) {
      return;
    }
    e.preventDefault();
    if (e.target.classList.contains("input__message"))
      this.newMessage = document.querySelector(".input__message").value.trim();

    if (
      this.newMessage !== "" ||
      e.target.parentElement.querySelector(".tooltip-active")
    ) {
      e.target.nextElementSibling.classList.add("hidden");
    }
  }

  onClickAddMessage(e) {
    if (!e.target.classList.contains("add__message")) {
      return;
    }
    e.preventDefault();
    const newMessage = this.getMessage();

    this.newMessage !== ""
      ? this.socket.sendMessage(newMessage, this.currentUser.name)
      : this.showTooltip("*Заполните поле");
  }

  keyUp(e) {
    if (e.target.classList.contains("input__message")) {
      if (e.key === "Enter") {
        console.log(this.currentUser, "this.currentUser");
        const newMessage = this.getMessage();

        this.newMessage !== ""
          ? this.socket.sendMessage(
              newMessage,
              this.currentUser.name,
              "message"
            )
          : this.showTooltip("*Заполните поле");
      }
    }
  }

  onClickExitBtn(e) {
    if (!e.target.classList.contains("exit__btn")) {
      return;
    }
    const data = {
      type: "exit",
      id: this.currentUser.id,
    };

    this.socket.sendMessage(data, this.currentUser.name);
    document.querySelectorAll(".user__card").forEach((elem) => elem.remove());
    this.modal.redrawModalForm();
  }

  removeUser(data) {
    this.users = document.querySelectorAll(".user__card");
    const userDel = [...this.users].find((elem) => elem.dataset.id === data);
    if (userDel) userDel.remove();
  }

  addUser(data) {
    try {
      this.users = document.querySelectorAll(".user__card");
      const index = [...this.users].findIndex(
        (elem) => elem.dataset.username === data.user.name
      );

      if (index === -1) this.renderingAcc(data.user, data.user.name);
    } catch (err) {
      console.log(err);
    }
  }
}
