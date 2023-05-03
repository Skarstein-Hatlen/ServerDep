var express = require('express');
var router = express.Router();
const fs = require('fs');
var path = require('path');
const AWS = require("aws-sdk");
const s3 = new AWS.S3()

// Or
/* GET pictures listing. */
router.get('/', function(req, res, next) {
    const pictures = fs.readdirSync(path.join(__dirname, '../pictures/'));
    res.render('pictures', { pictures: pictures});
});

router.post('/', function(req, res, next) {
    const file = req.files.file;
    fs.writeFileSync(path.join(__dirname, '../pictures/', file.name), file.data);
    res.end();
});

router.post('/', async function(req, res, next) {
    const file = req.files.file;
    console.log(req.files);
    await s3.putObject({
        Body: file.data,
        Bucket: process.env.CYCLIC_BUCKET_NAME,
        Key: "public/" + file.name,
    }).promise()
    res.end();
});

module.exports = router;