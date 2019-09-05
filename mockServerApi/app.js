const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");
const multipart = require("connect-multiparty");

const multipartMiddleware = multipart({
  uploadDir: "./uploads"
});

const files = {
  "dummy file": {
    locked: false,
    key: "1",
    path: "eg path",
    format: "pdf",
    processed: true,
    last_modified: "2019-9-3 19:32:36.435350"
  },
  "dummy file2": {
    locked: true,
    key: "2",
    path: "eg path",
    format: "pdf",
    processed: false,
    last_modified: "2019-9-3 19:32:36.435350"
  },
  "dummy file3": {
    locked: false,
    key: "3",
    path: "eg path",
    format: "pdf",
    processed: false,
    last_modified: "2019-9-3 19:32:36.435350"
  },
  "dummy file4": {
    locked: false,
    key: "3",
    path: "eg path",
    format: "pdf",
    processed: false,
    last_modified: "2019-9-3 19:32:36.435350"
  }
};

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.get("/api/user", (req, res) => {
  res.json({
    name: "anonymous",
    password: "1234567"
  });
});

app.get("/api/files", (req, res) => {
  res.json(files);
});

app.get("/api/selected/name", (req, res) => {
  res.json({
    name: "open this file",
    text: "i am working"
  });
});

app.post("/api/upload", multipartMiddleware, (req, res) => {
  let fileName = req.files.uploadFile.originalFilename;
  res.json({
    message: "File uploaded succesfully."
  });
});

app.listen(port, () => console.log(`mock app listening on port ${port}!`));
