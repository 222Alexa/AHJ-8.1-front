const ajaxSend = async (options) => {
  const URL = "https://chat222-ws.herokuapp.com/";
  const requestUrl = `${URL}?${options.query}`;
  console.log(requestUrl, "url");
  const request = await fetch(requestUrl, {
    method: options.method,
    body: options.data ? JSON.stringify(options.data) : null,
  });

  console.log(request, "request");
  const response = await request.json();
  // console.log(response, "response");
  if (options.callback) {
    options.callback(response);
  }
  console.log(response, "");
  return response;
};

export default ajaxSend;
