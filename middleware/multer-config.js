const multer         = require('multer');
const { v4: uuidv4 } = require('uuid');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, './uploads');
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const fileFormat = name.split('.');
    callback(null, `${file.fieldname.replace(/\s/g, '')}-${uuidv4()}.${fileFormat[fileFormat.length - 1]}`);
  }
});


module.exports = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {

    const extension = MIME_TYPES[file.mimetype]
    if (!extension) {
      return cb(new multer.MulterError(400, `That format isn't accepted`))
    }

    cb(null, true)
  }
}).any();