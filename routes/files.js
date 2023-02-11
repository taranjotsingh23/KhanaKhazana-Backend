const router = require('express').Router();
const multer = require('multer')
const path = require('path')
const File = require('../model/file')
const { v4: uuid4 } = require('uuid');

// initialize
let storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
        // Unique generate names
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
})


let upload = multer({
    storage,
    limit: { fileSize: 1000000 * 100 },
}).single('myFile')
// fieldName is important key


router.post('/files', (req, res) => {
    //Forming Current Date
    const date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    // This arrangement can be altered based on how we want the date's format to appear.
    let currentDate = `${day}-${month}-${year}`;
    // console.log(currentDate); // "17-6-2022"

    //Store file
    upload(req, res, async (err) => {
        //Validate request
        if (!req.file)
            return res.json({ error: "All fields are required." })
        if (err) return res.status(500).send({ error: err.message })
        // Store into Database
        const file = new File({
            resId: req.body.resId,
            filename: req.file.filename,
            uuid: uuid4(),
            path: req.file.path,
            size: req.file.size,
            foodQuantity: req.body.foodQuantity,
            foodType: req.body.foodType,
            orderStatus: "Pending",
            currDate: currentDate,
        })
        const response = await file.save();
        return res.json({ file: `${process.env.APP_BASE_URL}/files/download/${response.uuid}` });
    })
    //response -> link
})

module.exports = router;