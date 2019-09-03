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
    icon: this.faPdf,
    name: "dummy1",
    lastRan: "",
    type: "newFile"
  },
  {
    icon: this.faLock,
    name: "dummy2",
    lastRan: "",
    type: "locked"
  },
  {
    icon: this.faChart,
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
  res.json({
    message: "File uploaded succesfully."
  });
});

app.listen(port, () => console.log(`mock app listening on port ${port}!`));
