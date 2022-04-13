const sharp = require("sharp");
module.exports.sharpImage = (img) =>
  sharp(img)
    .rotate()
    .resize(200, 200)
    .jpeg({ mozjpeg: true, quality: 50, chromaSupsampling: "4:4:4" })
    .toFile(`./images/${img.split("\\")[1].split(".")[0]}.png`)
    .then((data) => {
      console.log(`Current size : ${data.size}`);
    })
    .catch((err) => {
      console.log(`error in sharp func`, err.message);
    });
