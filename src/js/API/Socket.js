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
    this.url = "wss://chat222-ws.herokuapp.com/";
    //this.url = "ws://localhost:8080/ws";
    this.ws = new WebSocket(this.url);

    this.ws.addEventListener("open", (evt) => {
      console.log("connected");

      //this.ctrl.addUser(evt.data);
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
    console.log(this.ws.readyState, "readyState");
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
      this.ws = new WebSocket(this.url);
    }
  }

  packingData(data, name) {
    const msg = JSON.parse(data);

    console.log(msg, "msg");

    if (msg.type === "message") {
      this.ctrl.renderingPost(msg, name);
    } else if (msg.type === "connect") {
      this.ctrl.addUser(msg);
    } else if (msg.type === "add") {
      this.ctrl.addUser(msg);
    } else if (msg.type === "exit") {
      const userDel = msg.id;
      this.ctrl.removeUser(userDel);

      // отсюда ws.close() отключает вообще всех
      // мне надо, чтобы отваливался от WS только тот, кто нажал на кнопку
      // и чтобы заново чат пользователь активировался через ajax,
      //window.reload() не особо помогает
      // на the websocket protocol ходила - не помогло
      //выяснила, что прерывает соединение тот, кто его инициировал
      //как это красиво сделать на клиенте,
      //если сервер "думает",что клиент еще активен
      //
      //this.ws.close(1000,"disconnect");
    }
  }
}
