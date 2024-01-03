const TaskController = require('../controllers/TaskController');

const express = require('express');
const router = express.Router();

// Create Task
router.post('/create-task', TaskController.registerTask);

// View Task
router.get('/all', TaskController.getTasks);

// Update Task
router.patch('/update/:id', TaskController.updateTask);

// Archive Task
router.delete('/delete/:id', TaskController.archiveTask);

module.exports = router;