const TaskController = require('../controllers/TaskController');

const express = require('express');
const router = express.Router();

// Create Task
router.post('/create-task', TaskController.register);

// View Task
router.get('/all', TaskController.getTasks);

// Update Task
router.patch('/update', TaskController.updateTask);

module.exports = router;