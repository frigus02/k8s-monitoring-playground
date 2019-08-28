const log = (severity, event, data) => {
  console.log(
    JSON.stringify({
      timestamp: new Date().toISOString(),
      severity,
      event,
      data
    })
  );
};

exports.info = (event, data) => {
  log("INFO", event, data);
};

exports.error = (event, data, error) => {
  log("ERROR", event, {
    ...data,
    error: {
      message: error.message,
      stack: error.stack
    }
  });
};
