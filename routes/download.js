const router = require('express').Router();

const File = require('../model/file')

router.get('/:uuid', async (req, res) => {
    const file = await File.findOne({ uuid: req.params.uuid });
    if (!file) {
        return res.status(400).send({ resCode: 400, message: "Link not correct" });
    }
    const filePath = `${__dirname}/../uploads/${file.filename}`;
    res.download(filePath);
});

module.exports = router;