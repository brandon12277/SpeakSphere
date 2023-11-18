const multer = require('multer');

const file_storage = multer.memoryStorage();

const upload = multer({
  storage: file_storage,
});

module.exports = upload;