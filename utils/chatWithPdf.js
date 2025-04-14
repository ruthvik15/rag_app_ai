const { spawn } = require("child_process");

const chatWithPDF = (userId, fileId, question) => {
  return new Promise((resolve, reject) => {
    const python = spawn("python", ["rag-processor/query.py", userId, fileId, question]);

    let data = "";
    let error = "";

    python.stdout.on("data", (chunk) => {
      data += chunk.toString();
    });

    python.stderr.on("data", (chunk) => {
      error += chunk.toString();
    });

    python.on("close", (code) => {
      if (code === 0) {
        resolve(data.trim());
      } else {
        reject(`Error: ${error}`);
      }
    });
  });
};

module.exports = { chatWithPDF };
