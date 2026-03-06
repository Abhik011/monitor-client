window.onerror = function (message, source, line, column, error) {

  fetch("https://your-backend.com/monitor", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      type: "frontend_error",
      message: message,
      source: source,
      line: line,
      page: window.location.href
    })
  });

};