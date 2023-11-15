import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";
import http from "http";
import dotenv from "dotenv";
import routeV1 from "./routes/index.js";
import Replicate from "replicate";
dotenv.config({path: '../.env'})
const app = express();

// app.use(cors());
const corsOptions = {
  origin: true, // Replace with your allowed origin(s)
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"], // Specify the HTTP methods allowed
  allowedHeaders: ["Content-Type", "Authorization"], // Specify the allowed request headers
  credentials: true, // Enable sending cookies across different domains
  preflightContinue: false, // Disable preflight requests caching
  optionsSuccessStatus: 200, // Set the response status code for successful OPTIONS requests
};
app.use(cors(corsOptions));






app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api/v1", routeV1);

const port = process.env.PORT || 5000;
const server = http.createServer(app);

mongoose.set("strictQuery", false);
console.log(process.env.MONGODB_URL)
mongoose.connect(process.env.MONGODB_URL).then(() => {
  console.log("Mongodb connected");
  server.listen(port, () => console.log(`Server is listening on port ${port}`));
}).catch((err) => {
  console.log({ err });
  process.exit(1);
});




// import cv2
// import numpy as np
// import random
  
  
// # Encryption function
// def encrypt():
      
//     # img1 and img2 are the
//     # two input images
//     img1 = cv2.imread('1.jpg')
//     img2 = cv2.imread('3.png')
//     img1 = cv2.resize(img1, (800, 800))
//     img2 = cv2.resize(img2, (800, 800))
//     for i in range(img2.shape[0]):
//         for j in range(img2.shape[1]):
//             for l in range(3):
                  
//                 # v1 and v2 are 8-bit pixel values
//                 # of img1 and img2 respectively
//                 v1 = format(img1[i][j][l], '08b')
//                 v2 = format(img2[i][j][l], '08b')
                  
//                 # Taking 4 MSBs of each image
//                 v3 = v1[:4] + v2[:4] 

//                 img1[i][j][l]= int(v3, 2)
                  
//     cv2.imwrite('pic3in2.png', img1)
  
      
// # Decryption function
// def decrypt():
      
//     # Encrypted image
//     img = cv2.imread('pic3in2.png') 
//     width = img.shape[0]
//     height = img.shape[1]
      
//     # img1 and img2 are two blank images
//     img1 = np.zeros((width, height, 3), np.uint8)
//     img2 = np.zeros((width, height, 3), np.uint8)
      
//     for i in range(width):
//         for j in range(height):
//             for l in range(3):
//                 v1 = format(img[i][j][l], '08b')
//                 v2 = v1[:4] + "0000"
//                 v3 = v1[4:] + "0000"
                  
//                 # Appending data to img1 and img2
//                 img1[i][j][l]= int(v2, 2)
//                 img2[i][j][l]= int(v3, 2)
      
//     # These are two images produced from
//     # the encrypted image
//     cv2.imwrite('pic2_re.png', img1)
//     cv2.imwrite('pic3_re.png', img2)
      
      
// # Driver's code
// encrypt()
// decrypt()


// import pyqrcode
// import png

// QRcode = pyqrcode.create('https://medium.com/@priyankdesai515')
// QRcode.png('code.png', scale=6, module_color=(0, 0, 0, 255), background=(255, 255, 255, 255))