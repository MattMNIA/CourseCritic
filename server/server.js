const express = require('express');
const mysql = require('mysql2');
var cors = require("cors");
const bcrypt = require('bcrypt');  // Add this import

// Next initialize the application
const app = express();
app.use(express.json()); // Add JSON parsing middleware
app.use(cors())
// routing path
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Add health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).send('healthy');
});

// Start the server
// Create MySQL connection
const connection = mysql.createConnection({
  host: process.env.DB_HOST,   // Use VM IP from .env or docker-compose
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
});

// Connect to MySQL
connection.connect(error => {
  if (error) {
    console.error('Error connecting to MySQL: ' + error.stack);
    return;
  }
  console.log('Connected to MySQL as id ' + connection.threadId);
  
  // Start Express server after successful DB connection
  app.listen(8001, () => {
    console.log('Server started on port 8001');
  });
});

// Hash password function
const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

// Register new user
app.post('/api/users/register', async (req, res) => {
  try {
    const { email, password, name, university } = req.body;

    // Check if user already exists
    connection.query(
      'SELECT id FROM users WHERE email = ?',
      [email],
      async (error, results) => {
        if (error) {
          return res.status(500).json({ error: error.message });
        }
        
        if (results.length > 0) {
          return res.status(400).json({ error: 'Email already registered' });
        }

        // Get university ID
        connection.query(
          'SELECT id FROM universities WHERE name = ?',
          [university],
          async (error, results) => {
            if (error || results.length === 0) {
              return res.status(400).json({ error: 'Invalid university' });
            }

            const university_id = results[0].id;
            const hashedPassword = await hashPassword(password);

            // Create new user with updated schema
            const user = {
              name,
              email,
              password_hash: hashedPassword,
              university_id,
              role: 'user',
              created_at: new Date()
            };

            connection.query('INSERT INTO users SET ?', user, (error, results) => {
              if (error) {
                return res.status(500).json({ error: error.message });
              }
              
              // Don't send password_hash back
              const { password_hash, ...userWithoutPassword } = user;
              res.status(201).json({
                id: results.insertId,
                ...userWithoutPassword
              });
            });
          }
        );
      }
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET all courses with university info
app.get('/api/courses', (req, res) => {
  console.log('GET /api/courses - Fetching all courses');
  connection.query(
    `SELECT c.id, c.course_name, c.course_code, c.university_id, u.name as university_name 
     FROM courses c 
     JOIN universities u ON c.university_id = u.id`,
    (error, results) => {
      if (error) {
        console.error('Error fetching courses:', error);
        return res.status(500).json({ error: error.message });
      }
      res.json(results);
    }
  );
});

// GET course by ID
app.get('/api/courses/:id', (req, res) => {
  console.log(`GET /api/courses/${req.params.id} - Fetching course by ID`);
  connection.query(
    'SELECT * FROM courses WHERE id = ?',
    [req.params.id],
    (error, results) => {
      if (error) {
        console.error('Error fetching course:', error);
        return res.status(500).json({ error: error.message });
      }
      console.log(`Found ${results.length} courses with ID ${req.params.id}`);
      if (results.length === 0) return res.status(404).json({ message: 'Course not found' });
      res.json(results[0]);
    }
  );
});

// GET universities
app.get('/api/universities', (req, res) => {
  console.log('GET /api/universities - Fetching all universities');
  connection.query('SELECT * FROM universities', (error, results) => {
    if (error) {
      console.error('Error fetching universities:', error);
      return res.status(500).json({ error: error.message });
    }
    res.json(results);
  });
});

// POST new course
app.post('/api/courses', (req, res) => {
  console.log('POST /api/courses - Creating new course:', req.body);
  
  connection.query(
    'SELECT id FROM universities WHERE name = ?',
    [req.body.university_name],
    (error, results) => {
      if (error || results.length === 0) {
        return res.status(400).json({ error: 'University not found' });
      }

      const course = {
        course_name: req.body.course_name,
        course_code: req.body.course_code,
        university_id: results[0].id
      };

      connection.query('INSERT INTO courses SET ?', course, (error, results) => {
        if (error) {
          console.error('Error creating course:', error);
          return res.status(500).json({ error: error.message });
        }
        res.status(201).json({ id: results.insertId, ...course });
      });
    }
  );
});

// PUT update course
app.put('/api/courses/:id', (req, res) => {
  const course = {
    course_name: req.body.course_name,
    course_code: req.body.course_code
  };

  connection.query(
    'UPDATE courses SET ? WHERE id = ?',
    [course, req.params.id],
    (error, results) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ message: 'Course not found' });
      }
      res.json({ id: req.params.id, ...course });
    }
  );
});

// DELETE course
app.delete('/api/courses/:id', (req, res) => {
  console.log(`DELETE /api/courses/${req.params.id} - Deleting course`);
  connection.query(
    'DELETE FROM test_courses WHERE idtest_courses = ?',
    [req.params.id],
    (error, results) => {
      if (error) {
        console.error('Error deleting course:', error);
        return res.status(500).json({ error: error.message });
      }
      console.log(`Deleted course: ${results.affectedRows} row(s) affected`);
      if (results.affectedRows === 0) return res.status(404).json({ message: 'Course not found' });
      res.status(204).send();
    }
  );
});
