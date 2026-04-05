const multer = require('multer');
const path = require('path');

// Configure multer for memory storage (process CSV in memory)
const storage = multer.memoryStorage();

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
if (['.csv', '.xlsx'].includes(path.extname(file.originalname).toLowerCase())) {
      cb(null, true);
    } else {
    cb(new Error('Only CSV or Excel files are allowed'), false);
    }
  }
});

module.exports = { single: upload.single.bind(upload) };
