const express = require('express');
const video = require('./video');
const app = express();
const fs = require("fs");

app.use('/video', video);

const port = process.env.PORT||8000;
app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});