

import cloudinary from "cloudinary";
import dotenv from "dotenv";
import fs from "fs";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

export const uploadImages = {
	
    upload: (req, res) => {
      try {
        const files = req.files.image;
  	console.log(files);
        // Kiểm tra nếu files là một mảng
        if (Array.isArray(files)) {
          const uploadPromises = files.map((file) => {
            return new Promise((resolve, reject) => {
              cloudinary.v2.uploader.upload(
                file.tempFilePath,
                {
                  folder: "img_pet_social",
                  crop: "fill",
                },
                (error, result) => {
                  if (error){ console.log(error); reject(error)};
                  removeTmp(file.tempFilePath);
                  resolve(result.secure_url);
                }
              );
            });
          });
  
          Promise.all(uploadPromises)
            .then((urls) => {
              return res.status(200).json({ urls });
            })
            .catch((error) => {
              return res.status(400).json({ error: error.message });
            });
        } else {
          // Xử lý khi chỉ có một ảnh
	console.log(req.files.image);
          cloudinary.v2.uploader.upload(
            files.tempFilePath,
            {
              folder: "img_pet_social",
              crop: "fill",
            },
            (error, result) => {
		console.log("error",error);
		console.log("------------------------");
		console.log("result",result);
              if (error) {
		console.log("----------------------------",error);
                removeTmp(files.tempFilePath);
                return res.status(400).json({ error: error.message });
              }
              removeTmp(files.tempFilePath);
              return res.status(200).json({ urls: [result.secure_url] });
            }
          );
        }
      } catch (error) {
	console.log("error----",error)
        return res.status(500).json({ error: error.message });
      }
    },
  };
  

    const removeTmp = (path) => {
    fs.unlink(path, (err) => {
        if (err) throw err;
    });
    };
