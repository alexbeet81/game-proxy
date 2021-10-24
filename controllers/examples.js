const HttpStatus = require('http-status-codes');
const Example = require('../models/example');
const mongoose = require('mongoose');
const settings = require('../settings.js')
const fs = require('fs')
const uploadsDir = settings.PROJECT_DIR + '/uploads'

exports.getAllExamples = (req, res, next) => {
    Example.find({}).then((examples) => {
        if(!examples) {
            return res.status(HttpStatus.StatusCodes.NO_CONTENT).json({ error: 'Invalid Examples', message: 'No examples were found' });
        }
        res.status(HttpStatus.StatusCodes.OK).json(examples);
    }).catch((error) => { res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error}) });
};

exports.getOneExample = (req, res) => {
    const id = req.params.id

    Example.findOne({_id: id}).then((example) => {
        if (!example) {
            return res.status(HttpStatus.StatusCodes.BAD_REQUEST).json({ error: 'Invalid Example', message: 'The example you specified isn\'t valid' });
        }
        res.status(HttpStatus.StatusCodes.OK).json(example);
    }).catch((error) => { res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error }) })
};

exports.createExample = (req, res) => {
    const exampleObject = JSON.parse(req.body.data)
    // fill it with whatever is in the model
    const example = new Example({})
    example.save().then(example => {
        res.status(HttpStatus.StatusCodes.CREATED).json({
            message: 'New example saved successfully!',
            example: example
        })}
    ).catch((error) => res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error }));
};

exports.updateExample = (req, res) => {
    const id = req.params.id
    const data = JSON.parse(req.body.data)

    Example.findByIdAndUpdate(id, data).then(example => {
        res.status(HttpStatus.StatusCodes.OK).json({
            message: 'Example successfully updated',
            example: example
        })
    }).catch((error) => res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error }));
}

// upload temporary images
exports.uploadTempImage = (req, res, next) => {
    if(!req.files) {
        res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Please send a file!' })
    } 
    let imageObj = req.files[0]
    let id = mongoose.Types.ObjectId()
    imageObj._id = id
    imageObj.uri = imageObj.path
    imageObj.name = imageObj.originalname
    
    res.status(HttpStatus.StatusCodes.OK).json(imageObj)
}

const deleteLocalPicture = (filename) => {
    fs.unlink(uploadsDir + `/${filename}`, function (err) {
        if (err) console.
            log(err);
        else console.log(`${filename} deleted.`);
    });
}

exports.removeExample = (req, res) => {
    const id = req.params.id

    Example.findOne({_id: id}).then((example) => {
        if (!example) {
            return res.status(HttpStatus.StatusCodes.BAD_REQUEST).json({ error: 'Invalid Example', message: 'The example you specified isn\'t valid' });
        }
        
        Example.deleteOne({ _id: id }).then(() => {
            res.status(HttpStatus.StatusCodes.OK).json({
                message: 'Example Deleted!'
            });
        }).catch((error) => {res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).json({error: error})});

    }).catch((error) => { res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error }) })
}