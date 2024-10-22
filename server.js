const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

// Use built-in middleware to handle JSON and URL-encoded form data
app.use(express.json()); // For parsing JSON request bodies
app.use(express.urlencoded({ extended: true })); // For parsing URL-encoded data

// Serve static files from the 'public' folder
app.use(express.static('public'));

// Set the port
const PORT = 5001;

// Path to the todos.json file
const filePath = path.join(__dirname, 'todos.json');

// Helper function to read from the file
const readTodos = () => {
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data || '[]'); // Return an empty array if file is empty
};

// Helper function to write to the file
const writeTodos = (todos) => {
  fs.writeFileSync(filePath, JSON.stringify(todos, null, 2));
};

// GET route to retrieve all tasks
app.get('/api/todos', (req, res) => {
  const todos = readTodos();
  res.json(todos);
});

// POST route to add a new task
app.post('/api/todos', (req, res) => {
  const newTask = req.body.task;
  
  if (!newTask) {
    return res.status(400).json({ error: 'Task is required' });
  }

  const todos = readTodos();
  const newTodo = { id: Date.now(), task: newTask, completed: false }; // Use lowercase `false`
  todos.push(newTodo);

  writeTodos(todos);
  res.json(newTodo);
});

// DELETE route to delete a task by id
app.delete('/api/todos/:id', (req, res) => {
  const todoID = parseInt(req.params.id);
  
  const todos = readTodos();
  const filteredTodos = todos.filter(todo => todo.id !== todoID);

  writeTodos(filteredTodos);
  res.json({ message: 'Task deleted' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
