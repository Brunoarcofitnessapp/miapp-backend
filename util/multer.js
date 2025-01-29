const multer = require('multer');
const path = require('path');
const AppError = require('./appError')

const imagestorage = multer.diskStorage({
    destination: (req, file, cb) => {
      if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
        cb(null, "public/photos");
      } else {
        cb({ message: "Only jpeg and png images are supported" }, false);
      }
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  });

  exports.imageuploadmiddleware = multer({storage:imagestorage})

// multer({
//     dest:multer.memoryStorage({}),
//     fileFilter:(req,file,callBack) => {
//         console.log(file.path);
//         let extension = path.extname(file.originalname)
//         if(extension !== ".mkv" && extension !== ".mp4" && extension !== ".mov"){
//             callBack(new AppError('Only these video extensions are allowed "mkv","mp4","mov',400),false)
//             return
//         }
//         console.log('done');
//         callBack(null, true)
//     } 
// })

const videoStorage =multer.diskStorage({
    destination: (req, file, cb) => {
      console.log(file.mimetype);
      if (file.mimetype.startsWith("video/")) {
        cb(null, "public/videos");
      } else {
        cb({ message: "This file is not in video format." }, false);
      }
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  });

exports.multervideouploadmiddleware = multer({storage: videoStorage});

