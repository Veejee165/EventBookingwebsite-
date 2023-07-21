const multer = require('multer');

// Create the Multer middleware
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: function (req, file, cb) {
    // Add any custom file filtering logic here (if needed)
    cb(null, true);
  },
});

module.exports = upload;
