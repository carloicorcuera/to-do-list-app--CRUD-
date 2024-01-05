const TaskController = require('../controllers/TaskController');

const express = require('express');
const router = express.Router();

// Multer
const multer = require('multer');
const path = require('path');  // To handle file paths
const fs = require('fs');  // To interact with the file system

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');  // The destination directory
    },
    filename: function(req, file, cb) {
        // Define how the filename should be constructed
        const fileExt = path.extname(file.originalname);  // Extract file extension
        const baseName = path.basename(file.originalname, fileExt);  // Extract base name without extension
    
        // Define a function to handle filename incrementing
        function generateFilename(basename, ext, num) {
        const suffix = num ? `(${num})` : "";
        const newName = `${basename}${suffix}${ext}`;
        if (fs.existsSync(`uploads/${newName}`)) {
            return generateFilename(basename, ext, num + 1);  // Recursive call with incremented suffix
        }
        return newName;
        }
    
        // Call the function to generate the filename
        const finalName = generateFilename(baseName, fileExt, 0);
        cb(null, finalName);
    }
    });
    
    const upload = multer({ storage: storage });

// Create Task
router.post('/create-task',  upload.single('file'), TaskController.registerTask);

// View Task
router.get('/all', TaskController.getTasks);

// Update Task
router.patch('/update/:id', upload.single('file'), TaskController.updateTask);

// Archive Task
router.delete('/delete/:id', TaskController.archiveTask);

module.exports = router;