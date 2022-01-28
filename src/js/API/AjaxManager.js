import ajaxSend from "./ajaxSend";

export default class AjaxManager {
  getStartedList(callback) {
    const options = {
      method: "GET",
      query: "method=getStartedList",
      callback,
    };

    return ajaxSend(options);
  }

  allTickets(callback) {
    const options = {
      method: "GET",
      query: "method=allTickets",
      callback,
    };

    return ajaxSend(options);
  }

  createNewUser(data, callback) {
    const options = {
      method: "POST",
      query: "method=createNewUser",
      data,
      callback,
    };

    return ajaxSend(options);
  }

  getUserName(name, callback) {
    const options = {
      method: "GET",
      query: `method=getUserByName&name=${name}`,
      callback,
    };

    return ajaxSend(options);
  }

  clearArrUsers(callback) {
    // это болванка
    const options = {
      method: "GET",
      query: "method=deleteAll",
      callback,
    };
    // console.log(options, 'options')

    return ajaxSend(options);
  }
}
