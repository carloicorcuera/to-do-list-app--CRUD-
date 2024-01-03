const mongoose = require("mongoose");
const request = require("supertest");

const Task = require('../models/Task');
const app = require("../app");

require("dotenv").config();

/* Connecting to the database before each test. */
beforeEach(async () => {
    await mongoose.connect(process.env.DATABASE_URL);
});

/* Closing database connection after each test. */
afterEach(async () => {
    await mongoose.connection.close();
});

describe("GET /tasks/all", () => {

    it("should return 404 when no active tasks are found", async () => {
        // ... assuming no active tasks are present ...

        const res = await request(app).get("/tasks/all");
        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty('message', 'No tasks found');
      });
  
    it("should return tasks with the correct structure and data types", async () => {
        // ... assuming tasks exist and are active ...

        const res = await request(app).get("/tasks/all");
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body.tasks)).toBe(true);
    
        res.body.tasks.forEach(task => {
          expect(task).toHaveProperty('_id');
          expect(task).toHaveProperty('title');
          expect(typeof task.title).toBe('string');
          expect(task).toHaveProperty('author');
          expect(typeof task.author).toBe('string');
          expect(task).toHaveProperty('task');
          expect(typeof task.task).toBe('string');
          expect(task).toHaveProperty('isActive');
          expect(task.isActive).toBe(true);
          expect(task).toHaveProperty('createdAt');
          expect(new Date(task.createdAt)).toBeInstanceOf(Date);
          expect(task).toHaveProperty('updatedAt');
          expect(new Date(task.updatedAt)).toBeInstanceOf(Date);
          expect(task).toHaveProperty('__v');
          expect(typeof task.__v).toBe('number');
        });
      });

      it("should handle server errors gracefully", async () => {
        // Mock Task.find to throw an error
        jest.spyOn(Task, 'find').mockImplementationOnce(() => {
          throw new Error("Fake server error");
        });
    
        const res = await request(app).get("/tasks/all");
        expect(res.statusCode).toBe(500);
        expect(res.body).toHaveProperty('error', 'Internal Server Error');
      });

});

describe("POST /tasks/create-task", () => {

    it("should successfully register a new task", async () => {
      // Mock request data for a new task
      const newTaskData = {
        title: "Unique1 Task Title",
        author: "Unique1 Task Author",
        task: "Unique1 Task description"
        // Include other necessary fields
      };
  
      const res = await request(app).post("/tasks/create-task").send(newTaskData);
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('message', 'Task successfully registered!');
      expect(res.body).toHaveProperty('userId'); // Assuming userId is actually taskId
    });
  
    it("should return 400 for invalid task data", async () => {
      const invalidData = {}; // Empty data or structure incorrect data as per requirements
  
      const res = await request(app).post("/tasks/create-task").send(invalidData);
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error', 'Request is Empty');
    });
  
    it("should prevent duplicate task titles", async () => {
      // Assuming a task with title "Duplicate Title" already exists in the database
  
      const duplicateTaskData = {
        title: "Unique Task Title",
        author: "Task Author",
        task: "Task description"
        // Include other necessary fields
      };
  
      const res = await request(app).post("/tasks/create-task").send(duplicateTaskData);
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('message', 'Title already registered!');
    });
  
    it("should handle server errors gracefully", async () => {
      // Mock Task.save or other database operations to throw an error
      jest.spyOn(Task.prototype, 'save').mockImplementationOnce(() => {
        throw new Error("Fake server error");
      });
  
      const taskData = {
        title: "Some Title",
        author: "Task Author",
        task: "Task description"
        // Include other necessary fields
      };
  
      const res = await request(app).post("/tasks/create-task").send(taskData);
      expect(res.statusCode).toBe(500);
      expect(res.body).toHaveProperty('error', 'Internal Server Error');
    });
  
});

describe("PATCH /tasks/update/:id", () => {

    it("should successfully update an existing task", async () => {
      // Assume validTaskId is an ID of an existing task
      const validTaskId = '6594d1446bdc71fb24999db4';
      const updateData = {
        title: "200 Updated Task Title",
        author: "200 Updated Task Title",
        task: "200 Updated Task Title",
      };
  
      const res = await request(app).patch(`/tasks/update/${validTaskId}`).send(updateData);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message', 'Task successfully updated!');
      expect(res.body.task).toMatchObject(updateData); // Checks if the task contains the update
    });
  
    it("should return 404 when task is not found", async () => {
      const nonExistentTaskId = '6594d1446bdc71fb24999db1';
      const updateData = {
        title: "404 Updated Task Title",
        author: "404 Updated Task Title",
        task: "404 Updated Task Title",
      };
  
      const res = await request(app).patch(`/tasks/update/${nonExistentTaskId}`).send(updateData);
      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('message', 'Task not found');
    });
  
    it("should handle invalid update data", async () => {
      // Assuming empty or invalid data structure is not allowed
      const invalidUpdateData = {};
  
      // Assume validTaskId is an ID of an existing task
      const validTaskId = '6594d1446bdc71fb24999db4';
  
      const res = await request(app).patch(`/tasks/update/${validTaskId}`).send(invalidUpdateData);
      // The expected status code might vary based on your implementation (could be 400 or another code)
      expect(res.statusCode).toBe(400); 
      expect(res.body).toHaveProperty('error', 'Invalid input data, missing title, author, or task');
    });
  
    it("should handle server errors gracefully", async () => {
      // Mock Task.findByIdAndUpdate to throw an error
      jest.spyOn(Task, 'findByIdAndUpdate').mockImplementationOnce(() => {
        throw new Error("Fake server error");
      });
  
      const taskId = '6594d1446bdc71fb24999db4';
      const updateData = {
        title: "500 Updated Task Title",
        author: "500 Updated Task Title",
        task: "500 Updated Task Title",
      };
  
      const res = await request(app).patch(`/tasks/update/${taskId}`).send(updateData);
      expect(res.statusCode).toBe(500);
      expect(res.body).toHaveProperty('error', 'Internal Server Error');
    });
  
});

describe("DELETE /delete/:id", () => {

    it("should successfully archive an existing task", async () => {
      // Assume validTaskId is an ID of an existing task
      const validTaskId = '6594d198669936b8acfc2ab3';
  
      const res = await request(app).delete(`/tasks/delete/${validTaskId}`);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message', 'Task successfully archived!');
      expect(res.body.task.isActive).toBe(false); // Verify the task is archived
    });
  
    it("should return 404 when task is not found", async () => {
      const nonExistentTaskId = '6594d198669936b8acfc2ab1';
  
      const res = await request(app).delete(`/tasks/delete/${nonExistentTaskId}`);
      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('message', 'Task not found');
    });
  
    it("should handle server errors gracefully", async () => {
      // Mock Task.findByIdAndUpdate to throw an error
      jest.spyOn(Task, 'findByIdAndUpdate').mockImplementationOnce(() => {
        throw new Error("Fake server error");
      });
  
      const taskId = '6594d198669936b8acfc2ab3';
  
      const res = await request(app).delete(`/tasks/delete/${taskId}`);
      expect(res.statusCode).toBe(500);
      expect(res.body).toHaveProperty('error', 'Internal Server Error');
    });
  
  });
  