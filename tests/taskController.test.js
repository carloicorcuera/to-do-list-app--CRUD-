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
          expect(task).toHaveProperty('subtitle');
          expect(typeof task.subtitle).toBe('string');
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

});

describe("POST /tasks/create-task", () => {

    // it("should successfully register a new task", async () => {
    //   // Mock request data for a new task
    //   const newTaskData = {
    //     title: "Unique Task Title",
    //     subtitle: "Task Subtitle",
    //     task: "Task description"
    //     // Include other necessary fields
    //   };
  
    //   const res = await request(app).post("/tasks/create-task").send(newTaskData);
    //   expect(res.statusCode).toBe(201);
    //   expect(res.body).toHaveProperty('message', 'Task successfully registered!');
    //   expect(res.body).toHaveProperty('userId'); // Assuming userId is actually taskId
    // });
  
    // it("should return 400 for invalid task data", async () => {
    //   const invalidData = {}; // Empty data or structure incorrect data as per requirements
  
    //   const res = await request(app).post("/tasks/create-task").send(invalidData);
    //   expect(res.statusCode).toBe(400);
    //   expect(res.body).toHaveProperty('error', 'Request is Empty');
    // });
  
    // it("should prevent duplicate task titles", async () => {
    //   // Assuming a task with title "Duplicate Title" already exists in the database
  
    //   const duplicateTaskData = {
    //     title: "Unique Task Title",
    //     subtitle: "Task Subtitle",
    //     task: "Task description"
    //     // Include other necessary fields
    //   };
  
    //   const res = await request(app).post("/tasks/create-task").send(duplicateTaskData);
    //   expect(res.statusCode).toBe(400);
    //   expect(res.body).toHaveProperty('message', 'Title already registered!');
    // });
  
    it("should handle server errors gracefully", async () => {
      // Mock Task.save or other database operations to throw an error
      jest.spyOn(Task.prototype, 'save').mockImplementationOnce(() => {
        throw new Error("Fake server error");
      });
  
      const taskData = {
        title: "Some Title",
        subtitle: "Task Subtitle",
        task: "Task description"
        // Include other necessary fields
      };
  
      const res = await request(app).post("/tasks/create-task").send(taskData);
      expect(res.statusCode).toBe(500);
      expect(res.body).toHaveProperty('error', 'Internal Server Error');
    });
  
});
  