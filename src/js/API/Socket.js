import Board from "../Board";
// eslint-disable-next-line import/no-cycle
import Controller from "../Controller";

export default class Socket {
  constructor(name) {
    this.name = name;
  }

  init() {
    const board = new Board(document.getElementById("container"));
    this.ctrl = new Controller(board);
    this.url = "wss://chat222-ws.herokuapp.com/ws";

    this.ws = new WebSocket(this.url);

    this.ws.addEventListener("open", (evt) => {
      console.log("connected");
    });

    this.ws.addEventListener("message", (evt) => {
      console.log("message");

      this.packingData(evt.data, this.name);
    });

    this.ws.addEventListener("close", (evt) => {
      console.log("connection closed", evt);
    });

    this.ws.addEventListener("error", () => {
      console.log("error");
    });
  }

  /**
   * принимает данные сообщений и имя автора
   * обменивается ими с сервером
   */
  sendMessage(data, name) {
    if (this.ws.readyState === WebSocket.OPEN) {
      try {
        const jsonMSG = JSON.stringify(data);
        this.ws.send(jsonMSG);
        this.name = name;
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("Соединение разорвано, переподключаю...");
      this.ws = new WebSocket(this.url, this.currentUser);
    }
  }

  packingData(data, name) {
    const msg = JSON.parse(data);

    console.log(msg, "msg");

    if (msg.type === "message") {
      this.ctrl.renderingPost(msg, name);
    } else if (msg.type === "add") {
      this.ctrl.addUser(msg);
    } else if (msg.type === "exit") {
      const userDel = msg.id;
      this.ctrl.removeUser(userDel);
      // отсюда ws.close() отключает вообще всех
      // мне надо, чтобы отваливался от WS только тот, кто нажал на кнопку
      // и чтобы заново чат пользователь активировался через ajax
      // и еще при обновлении страницы ws отваливается,
      // но пользователь при этом остается активным
      // пока не придумала как это побеждать
      // this.ws.close();
    }
  }
}
