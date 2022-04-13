const fs = require("fs");
module.exports.unlinkUncompressedFiles = () => {
  const directory = "oldImages";
  fs.readdir(directory, (err, files) => {
    if (err) throw err.message;

    for (const file of files) {
      fs.unlink(`${directory}/${file}`, (err) => {
        if (err) throw err.message;
      });
    }
  });
};
