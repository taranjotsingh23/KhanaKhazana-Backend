const router = require('express').Router();
const multer = require('multer')
const path = require('path')
const ngoFile = require('../model/ngoFile')
const { v4: uuid4 } = require('uuid');
const firebase = require("firebase/app");
const admin = require("firebase-admin");
const credentials =require("../key.json");

// admin.initializeApp({
//     credential:admin.credential.cert(credentials)
// });
const db=admin.firestore();

const { getStorage, ref, uploadBytes, getDownloadURL } = require("firebase/storage");

const firebaseConfig = {
  apiKey: "AIzaSyAJD3HvTIiQ9s4fVbsJPbT9WTG_jTKOXo8",
  authDomain: "khana-khazana-a930d.firebaseapp.com",
  projectId: "khana-khazana-a930d",
  storageBucket: "khana-khazana-a930d.appspot.com",
  messagingSenderId: "345512418472",
  appId: "1:345512418472:web:ba922364b966fefe9ef69d"
};

firebase.initializeApp(firebaseConfig);

const storage = getStorage();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/ngoFiles', upload.single("myFile"), async (req, res) => {
    const storageRef = ref(storage, `ngoFiles/${req.file.originalname}`);
    const distributionId=uuid4();
    const ngoId=req.body.ngoId;

    //Forming Current Date
    const date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    let currentDate = `${day}-${month}-${year}`;
    // console.log(currentDate); // "17-6-2022"
  
    const snap=await uploadBytes(storageRef, req.file.buffer).then((snapshot) => {
      console.log("NGO file uploaded");
      getDownloadURL(ref(storage, `ngoFiles/${req.file.originalname}`)).then((url)=> {
        console.log("URL: "+url);

        try{
          const userJson={
              distributionId: distributionId,
              ngoId: ngoId,
              foodImgURL: url
          };
          const response=db.collection("ngoUsers").doc(distributionId).set(userJson);
          console.log(userJson);
      } catch(error) {
          console.log(error);
      }
    
      });
    });
  
    console.log(req.file);

    const file = new ngoFile({
        distributionId: distributionId,
        ngoId: ngoId,
        foodQuantity: req.body.foodQuantity,
        currDate: currentDate,
    })
    const response = await file.save();

    res.status(200).send({ resCode: 200, message: "NGO File,User Uploaded Successfully" });

});

module.exports = router;