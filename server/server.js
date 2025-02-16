const express = require('express');
const mysql = require('mysql2');
var cors = require("cors");
const bcrypt = require('bcrypt');

// Next initialize the application
const app = express();
app.use(express.json()); // Add JSON parsing middleware
app.use(cors())
// routing path
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Simple health check that doesn't depend on DB
app.get('/api/health', (req, res) => {
  res.status(200).send('healthy');
});

// Create MySQL connection
const connection = mysql.createConnection({
  host: process.env.DB_HOST,   // Use VM IP from .env or docker-compose
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
});

// Start the server first, then connect to DB
const startServer = async () => {
  const server = app.listen(process.env.PORT || 8001, () => {
    console.log('Server started on port', process.env.PORT || 8001);
  });

  try {
    await new Promise((resolve, reject) => {
      connection.connect(error => {
        if (error) {
          console.error('Error connecting to MySQL:', error.stack);
          reject(error);
        } else {
          console.log('Connected to MySQL as id', connection.threadId);
          resolve();
        }
      });
    });
  } catch (error) {
    console.error('Failed to connect to database:', error);
    // Don't exit process, let server keep running
  }
};

startServer();

// GET all courses
app.get('/api/courses', (req, res) => {
  console.log('GET /api/courses - Fetching all courses');
  connection.query('SELECT * FROM courses', (error, results) => {
    if (error) {
      console.error('Error fetching courses:', error);
      return res.status(500).json({ error: error.message });
    }
    console.log(`Found ${results.length} courses`);
    res.json(results);
  });
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

// POST new course
app.post('/api/courses', (req, res) => {
  console.log('POST /api/courses - Creating new course:', req.body);
  const course = {
    course_name: req.body.course_name,
    course_code: req.body.course_code,
    university_id: course_code
  };

  connection.query('INSERT INTO courses SET ?', course, (error, results) => {
    if (error) {
      console.error('Error creating course:', error);
      return res.status(500).json({ error: error.message });
    }
    console.log(`Created course with ID ${results.insertId}`);
    res.status(201).json({ id: results.insertId, ...course });
  });
});

// PUT update course
app.put('/api/courses/:id', (req, res) => {
  console.log(`PUT /api/courses/${req.params.id} - Updating course:`, req.body);
  const course = {
    course_name: req.body.course_name,
    difficulty: req.body.difficulty,
    hours_of_work: req.body.hours_of_work,
    utility: req.body.utility,
    professor: req.body.professor,
    test_coursescol: req.body.test_coursescol
  };

  connection.query(
    'UPDATE test_courses SET ? WHERE idtest_courses = ?',
    [course, req.params.id],
    (error, results) => {
      if (error) {
        console.error('Error updating course:', error);
        return res.status(500).json({ error: error.message });
      }
      console.log(`Updated course: ${results.affectedRows} row(s) affected`);
      if (results.affectedRows === 0) return res.status(404).json({ message: 'Course not found' });
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

// Updated register endpoint
app.post('/api/users/register', async (req, res) => {
  try {
    const { email, password, name, university } = req.body;
    
    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }

    console.log('Registration attempt:', { email, name, university });

    // Check if user exists
    connection.query(
      'SELECT id FROM users WHERE email = ?',
      [email],
      async (error, results) => {
        if (error) {
          console.error('Database error checking email:', error);
          return res.status(500).json({ error: 'Database error' });
        }
        
        if (results.length > 0) {
          return res.status(400).json({ error: 'Email already registered' });
        }

        // Check if university exists by ID
        connection.query(
          'SELECT id FROM universities WHERE id = ?',
          [university],
          async (error, results) => {
            if (error) {
              console.error('Database error checking university:', error);
              return res.status(500).json({ error: 'Database error' });
            }
            
            if (results.length === 0) {
              return res.status(400).json({ error: 'Invalid university selected' });
            }

            try {
              const hashedPassword = await hashPassword(password);
              const user = {
                name,
                email,
                password_hash: hashedPassword,
                university_id: university,
                role: 'user'
              };

              connection.query('INSERT INTO users SET ?', user, (error, results) => {
                if (error) {
                  console.error('Database error creating user:', error);
                  return res.status(500).json({ error: 'Failed to create user' });
                }

                // Return user data without password
                const { password_hash, ...userWithoutPassword } = user;
                res.status(201).json({
                  id: results.insertId,
                  ...userWithoutPassword
                });
              });
            } catch (hashError) {
              console.error('Password hashing error:', hashError);
              res.status(500).json({ error: 'Error processing password' });
            }
          }
        );
      }
    );
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add login endpoint
app.post('/api/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    connection.query(
      'SELECT id, email, name, password_hash, role, university_id FROM users WHERE email = ?',
      [email],
      async (error, results) => {
        if (error) {
          return res.status(500).json({ error: 'Database error' });
        }

        if (results.length === 0) {
          return res.status(401).json({ error: 'Invalid email or password' });
        }

        const user = results[0];
        const validPassword = await bcrypt.compare(password, user.password_hash);

        if (!validPassword) {
          return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Don't send password hash back
        const { password_hash, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
      }
    );
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Update hash password function with proper error handling
const hashPassword = async (password) => {
  if (!password) {
    throw new Error('Password is required');
  }
  try {
    const saltRounds = 10;
    return await bcrypt.hash(password.toString(), saltRounds);
  } catch (error) {
    console.error('Password hashing error:', error);
    throw new Error('Failed to hash password');
  }
};

// Add universities endpoint - place this with other endpoints
app.get('/api/universities', async (req, res) => {
  console.log('GET /api/universities - Fetching all universities with stats');
  try {
    const [results] = await connection.promise().query(`
      SELECT 
        u.id,
        u.name,
        COUNT(DISTINCT c.id) as course_count,
        COUNT(DISTINCT r.id) as review_count,
        COUNT(DISTINCT r.user_id) as student_count
      FROM universities u
      LEFT JOIN courses c ON u.id = c.university_id
      LEFT JOIN reviews r ON c.id = r.course_id
      GROUP BY u.id, u.name
      ORDER BY u.name ASC
    `);
    
    console.log(`Found ${results.length} universities`);
    res.json(results);
  } catch (error) {
    console.error('Error fetching universities:', error);
    res.status(500).json({ error: 'Failed to fetch universities' });
  }
});
