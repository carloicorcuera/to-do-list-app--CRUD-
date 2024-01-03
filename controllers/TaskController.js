const Task = require('../models/Task');

// Create Task
module.exports.registerTask = async (request, response) => {
    let data = request.body;

    try {
        if (request.body == null) {
          return response.status(400).json({ error: "Invalid task" });
        }
    
        // Check if email already exists in the database
        const existingTitle = await Task.findOne({ title: request.body.title });
    
        if (existingTitle) {
          return response.status(400).json({ message: "Title already registered!" });
        }
    
        // Business logic for user registration
        const newTask = new Task({
          title: request.body.title,
          subtitle: request.body.subtitle,
          task: request.body.task,
          task: request.body.task,
        });
    
        const created_task = await newTask.save();
    
        response.status(201).json({
          message: 'Task successfully registered!',
          userId: created_task._id 
        });
    
      } catch (error) {
        console.error('Error in register:', error);
        response.status(500).json({ error: 'Internal Server Error' });
      }
};

// Get Task
module.exports.getTasks = async (request, response) => {
    try {
        // Fetch all tasks that are active
        const tasks = await Task.find({ isActive: true });

        // Check if any tasks were found
        if (tasks.length === 0) {
            return response.status(404).json({ message: 'No tasks found' });
        }

        // Respond with the tasks found. Changed the status code to 200 for successful retrieval
        response.status(200).json({
          tasks // Sending back the array of tasks found
        });

    } catch (error) {
        console.error('Error in getting tasks:', error);
        response.status(500).json({ error: 'Internal Server Error' });
    }
};

// Update Task
module.exports.updateTask = async (request, response) => {
    try {
        // Extract _id and update details from request
        const taskId = request.params.id; // assuming _id is passed as URL parameter
        const updateDetails = request.body; // the details to update

        // Find the task by _id and update it
        const updatedTask = await Task.findByIdAndUpdate(
            taskId, // MongoDB _id of the task
            updateDetails, // update
            { new: true } // options: return the modified document rather than the original
        );

        // Check if the task was found and updated
        if (!updatedTask) {
            return response.status(404).json({ message: 'Task not found' });
        }

        // Respond with the updated task
        response.status(200).json({
            message: 'Task successfully updated!',
            task: updatedTask
        });

    } catch (error) {
        console.error('Error in updating task:', error);
        response.status(500).json({ error: 'Internal Server Error' });
    }
};

// Archive Task
module.exports.archiveTask = async (request, response) => {
  try {
      const taskId = request.params.id; // Extracting _id from the request URL parameter

      // Set the update details to change isActive to false
      const updateDetails = { isActive: false };

      // Find the task by _id and update its isActive status
      const updatedTask = await Task.findByIdAndUpdate(
          taskId, // MongoDB _id of the task
          updateDetails, // Update isActive to false
          { new: true } // Option to return the modified document
      );

      // Check if the task was found and updated
      if (!updatedTask) {
          return response.status(404).json({ message: 'Task not found' });
      }

      // Respond with the updated task
      response.status(200).json({
          message: 'Task successfully archived!',
          task: updatedTask
      });

  } catch (error) {
      console.error('Error in archiving task:', error);
      response.status(500).json({ error: 'Internal Server Error' });
  }
};







