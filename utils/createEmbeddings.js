const { spawn } = require("child_process");

const createEmbeddings = (filePath, userId, fileId) => {
  return new Promise((resolve, reject) => {
    const python = spawn("python", ["rag-processor/ingest.py", filePath, userId, fileId]);

    let output = "";
    let error = "";

    python.stdout.on("data", (data) => {
      output += data.toString();
    });

    python.stderr.on("data", (data) => {
      error += data.toString();
    });

    python.on("close", (code) => {
      if (code === 0) {
        resolve(output.trim());
      } else {
        reject(`Python Error: ${error}`);
      }
    });
  });
};

module.exports = { createEmbeddings };
