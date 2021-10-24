const express = require('express');
const examplesCtrl = require('../controllers/examples');
const auth = require('../middleware/auth.js');
const multer = require('../middleware/multer-config');
const router = express.Router();

// get all examples
router.get('/', examplesCtrl.getAllExamples);
// get one example 
router.get('/:id', examplesCtrl.getOneExample);
// create an example
router.post('/', [multer, auth, examplesCtrl.createExample]);
// edit example
router.put('/:id', [multer, auth, examplesCtrl.updateExample]);
// delete example
router.delete('/:id', auth, examplesCtrl.removeExample);
// show temp image
router.post('/uploadTempImage', [multer, auth, examplesCtrl.uploadTempImage]);


module.exports = router;