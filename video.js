const express = require("express");
const router = express.Router();
const fs = require('fs');
// get video stats (about 61MB)
  let fileName = "bigbuck.mp4";
  const videoPath = fileName;
  const videoSize = fs.statSync(fileName).size;
router.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

router.get("/1", (req, res, next) => {
  // Ensure there is a range given for the video
  const range = req.headers.range;
  if (!range) {
      const head = {
        "Content-Length": videoSize,
        "Content-Type": "video/mp4",
      };
      res.writeHead(200, head);
      fs.createReadStream(videoPath).pipe(res);
  }else{

  
  // Parse Range
  // Example: "bytes=32324-"
//   const CHUNK_SIZE = 1024 ** 2; // 1MB
//   const start = Number(range.replace(/\D/g, ""));
//   const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
  

  let parts = range.replace(/bytes=/, "").split("-");
  let start = parseInt(parts[0], 10);
  let end = parts[1] ? parseInt(parts[1], 10) : videoSize - 1;
  let chunkSize = end - start + 1;

  // Create headers
  const contentLength = end - start + 1;
  const headers = {
    "Content-Range": `bytes ${start}-${end}/${videoSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": chunkSize,
    "Content-Type": "video/mp4",
  };

  // HTTP Status 206 for Partial Content
  res.writeHead(206, headers);

  // create video read stream for this particular chunk
  const videoStream = fs.createReadStream(videoPath, { start, end });

  // Stream the video chunk to the client
  videoStream.pipe(res);
  //res.sendFile(__dirname + "/index.html");
}
});

module.exports = router;
