const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");
const multipart = require("connect-multiparty");

const multipartMiddleware = multipart({
  uploadDir: "./uploads"
});

const files = [
  {
    id: "1",
    name: "dummy1",
    lastRan: "",
    type: "newFile"
  },
  {
    id: "2",
    name: "dummy2",
    lastRan: "",
    type: "locked"
  },
  {
    id: "3",
    name: "dummy3",
    lastRan: "",
    type: "analyzed"
  }
];

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

app.post("/api/upload", multipartMiddleware, (req, res) => {
  let fileName = req.files.uploadFile.originalFilename;
  res.json({
    message: "File uploaded succesfully."
  });
});

app.listen(port, () => console.log(`mock app listening on port ${port}!`));
