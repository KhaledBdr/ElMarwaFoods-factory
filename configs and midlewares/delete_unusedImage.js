const fs = require("fs");
const { getImgesName } = require("../models/employeesModel");

// Delete Un Used Images
async function deleteIMG() {
  numOfImages = 1;
  let deletedImages = 0;
  const Images = await getImgesName();
  // read images file
  let ImageArray = [];
  for (let i = 0; i < Images.length; i++) {
    ImageArray.push(Images[i].image);
  }
  const filesName = fs.readdirSync("./images/");

  filesName.forEach((file) => {
    if (file != "default.png") {
      numOfImages++;
      // get images which used from database

      if (ImageArray.includes(file)) {
        //if image is in DB do no thing
      } else {
        numOfImages--;
        deletedImages++;
        //else delete it from the file
        fs.unlink(`./images//${file}`, (err) => {
          if (err) return console.log(err);
        });
      }
    }
  });

  // Print number of deleted images
  console.log(`Current Images : ${numOfImages}`);
  console.log(`Deleted Images : ${deletedImages}`);
}
module.exports = deleteIMG;
