const express = require('express');
const mysql = require('mysql2');
const cors = require("cors");
const bcrypt = require('bcrypt');

// Create MySQL connection pool instead of single connection
const pool = mysql.createPool({
  host: "157.230.188.42",
  user: "admin",
  password: "admin_password",
  database: "coursecritic",
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
}).promise(); // Convert to promise-based pool

const app = express();

// Update CORS configuration
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json()); // Add JSON parsing middleware

// Add OPTIONS handling for preflight requests
app.options('*', cors());

// routing path
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Simple health check that doesn't depend on DB
app.get('/api/health', (req, res) => {
  res.status(200).send('healthy');
});

// Start the server first, then connect to DB
const startServer = async () => {
  try {
    // Test the pool with a simple query
    await pool.query('SELECT 1');
    console.log('Database pool initialized successfully');
    
    app.listen(process.env.PORT || 8001, () => {
      console.log('Server started on port', process.env.PORT || 8001);
    });
  } catch (error) {
    console.error('Failed to initialize database pool:', error);
    process.exit(1);
  }
};

startServer();

// GET all courses
app.get('/api/courses', (req, res) => {
  console.log('GET /api/courses - Fetching all courses');
  pool.query('SELECT * FROM courses', (error, results) => {
    if (error) {
      console.error('Error fetching courses:', error);
      return res.status(500).json({ error: error.message });
    }
    console.log(`Found ${results.length} courses`);
    res.json(results);
  });
});

// GET course by ID
app.get('/api/courses/:id', async (req, res) => {
  console.log(`GET /api/courses/${req.params.id} - Fetching course by ID`);
  try {
    const [results] = await pool.query(`
      SELECT 
        c.*,
        CAST(AVG(r.difficulty) AS DECIMAL(10,2)) as average_difficulty,
        CAST(AVG(r.workload) AS DECIMAL(10,2)) as average_hours,
        CAST(AVG(r.usefulness) AS DECIMAL(10,2)) as average_usefulness,
        COUNT(r.id) as review_count
      FROM courses c
      LEFT JOIN reviews r ON c.id = r.course_id
      WHERE c.id = ?
      GROUP BY c.id
    `, [req.params.id]);

    if (results.length === 0) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Convert numeric strings to numbers
    const course = {
      ...results[0],
      average_difficulty: Number(results[0].average_difficulty),
      average_hours: Number(results[0].average_hours),
      average_usefulness: Number(results[0].average_usefulness)
    };

    console.log('Found course:', course);
    res.json(course);
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/course/:id', (req, res) => {
  console.log(`GET /api/course/${req.params.id} - Fetching course by ID`);
  pool.query(
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

// GET courses by university ID
app.get('/api/courses/university/:universityId', async (req, res) => {
  console.log(`GET /api/courses/university/${req.params.universityId} - Fetching courses by university`);
  try {
    const [results] = await pool.query(
      'SELECT * FROM courses WHERE university_id = ?',
      [req.params.universityId]
    );
    
    console.log(`Found ${results.length} courses for university ${req.params.universityId}`);
    res.json(results);
  } catch (error) {
    console.error('Error fetching university courses:', error);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

// GET search courses
app.get('/api/search/courses', async (req, res) => {
  console.log('GET /api/search/courses - Searching courses with params:', req.query);
  try {
    // const { universityId, courseId, professorId } = req.query;
    const universityId = req.query["university_id"];
    const courseId = req.query["course_id"];
    const professorId = req.query["professor_id"];
    let query = `
      SELECT 
        c.*,
        CAST(AVG(r.difficulty) AS DECIMAL(10,2)) as difficulty,
        CAST(AVG(r.workload) AS DECIMAL(10,2)) as workload,
        CAST(AVG(r.usefulness) AS DECIMAL(10,2)) as usefulness,
        COUNT(DISTINCT r.id) as review_count
      FROM courses c
      LEFT JOIN reviews r ON c.id = r.course_id
    `;

    const whereConditions = [];
    const params = [];

    if (universityId) {
      whereConditions.push('c.university_id = ?');
      params.push(universityId);
    }

    if (courseId) {
      whereConditions.push('c.id = ?');
      params.push(courseId);
    }

    if (professorId) {
      whereConditions.push('EXISTS (SELECT 1 FROM reviews r2 WHERE r2.course_id = c.id AND r2.professor_id = ?)');
      params.push(professorId);
    }

    if (whereConditions.length > 0) {
      query += ' WHERE ' + whereConditions.join(' AND ');
    }

    query += ' GROUP BY c.id';

    const [results] = await pool.query(query, params);
    
    // Convert string values to numbers
    const processedResults = results.map(course => ({
      ...course,
      difficulty: course.difficulty ? Number(course.difficulty) : null,
      workload: course.workload ? Number(course.workload) : null,
      usefulness: course.usefulness ? Number(course.usefulness) : null,
      review_count: Number(course.review_count)
    }));
    
    console.log(`Found ${results.length} courses matching criteria`);
    res.json(processedResults);
  } catch (error) {
    console.error('Error searching courses:', error);
    res.status(500).json({ error: 'Failed to search courses' });
  }
});

// POST new course
app.post('/api/courses', (req, res) => {
  console.log('POST /api/courses - Creating new course:', req.body);
  const course = {
    course_name: req.body.course_name,
    course_code: req.body.course_code,
    university_id: course_code
  };

  pool.query('INSERT INTO courses SET ?', course, (error, results) => {
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

  pool.query(
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
  pool.query(
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
    const [existingUsers] = await pool.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Check if university exists
    const [universities] = await pool.query(
      'SELECT id FROM universities WHERE id = ?',
      [university]
    );

    if (universities.length === 0) {
      return res.status(400).json({ error: 'Invalid university selected' });
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(password);
    const user = {
      name,
      email,
      password_hash: hashedPassword,
      university_id: university,
      role: 'user'
    };

    // Insert the new user
    const [result] = await pool.query('INSERT INTO users SET ?', user);
    
    // Return user data without password
    const userResponse = {
      id: result.insertId,
      email: user.email,
      name: user.name,
      role: user.role,
      university_id: user.university_id
    };

    console.log('Registration successful:', userResponse);
    res.status(201).json(userResponse);

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      error: 'Failed to register user',
      details: error.message 
    });
  }
});

// Add login endpoint
app.post('/api/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt for:', email);

    // Find user by email using promise-based query
    const [users] = await pool.query(
      'SELECT id, email, name, password_hash, role, university_id FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      console.log('User not found:', email);
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = users[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);

    if (!validPassword) {
      console.log('Invalid password for:', email);
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Don't send password hash back
    const { password_hash, ...userWithoutPassword } = user;
    console.log('Login successful for:', email);
    res.json(userWithoutPassword);

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
    const [results] = await pool.query(`
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
    
    // Ensure we're sending an array
    if (!Array.isArray(results)) {
      console.error('Query results is not an array:', results);
      return res.status(500).json({ error: 'Invalid data format' });
    }

    console.log(`Found ${results.length} universities:`, results);
    res.json(results);
  } catch (error) {
    console.error('Error fetching universities:', error);
    res.status(500).json({ 
      error: 'Failed to fetch universities',
      details: error.message 
    });
  }
});

// Add this endpoint before your other routes
app.get('/api/universities/search', async (req, res) => {
  try {
    const { q = '', page = 1, limit = 24 } = req.query;
    const offset = (page - 1) * limit;
    
    // First get total count for pagination
    const [countResult] = await pool.query(
      `SELECT COUNT(*) as total 
       FROM universities 
       WHERE name LIKE ?`,
      [`%${q}%`]
    );
    
    const total = countResult[0].total;

    // Then get paginated results
    const [universities] = await pool.query(
      `SELECT id, name, 
        (SELECT COUNT(*) FROM courses WHERE university_id = universities.id) as course_count,
        (SELECT COUNT(*) FROM users WHERE university_id = universities.id) as student_count
       FROM universities 
       WHERE name LIKE ? 
       ORDER BY name ASC
       LIMIT ? OFFSET ?`,
      [`%${q}%`, parseInt(limit), parseInt(offset)]
    );

    res.json({
      universities,
      hasMore: offset + universities.length < total
    });

  } catch (error) {
    console.error('Error searching universities:', error);
    res.status(500).json({ error: 'Failed to search universities' });
  }
});

// GET university by ID
app.get('/api/universities/:id', async (req, res) => {
  try {
    const [results] = await pool.query(
      'SELECT id, name FROM universities WHERE id = ?',
      [req.params.id]
    );
    
    if (results.length === 0) {
      return res.status(404).json({ error: 'University not found' });
    }
    
    res.json(results[0]);
  } catch (error) {
    console.error('Error fetching university:', error);
    res.status(500).json({ error: 'Failed to fetch university' });
  }
});

// GET all professors
app.get('/api/professors', async (req, res) => {
  console.log('GET /api/professors - Fetching all professors');
  try {
    const [results] = await pool.query(
      'SELECT DISTINCT professor as name, id FROM courses WHERE professor IS NOT NULL'
    );
    
    console.log(`Found ${results.length} professors`);
    res.json(results);
  } catch (error) {
    console.error('Error fetching professors:', error);
    res.status(500).json({ error: 'Failed to fetch professors' });
  }
});

// GET professors by university
app.get('/api/professors/university/:universityId', async (req, res) => {
  console.log(`GET /api/professors/university/${req.params.universityId} - Fetching professors by university`);
  try {
    const [results] = await pool.query(
      'SELECT id, name FROM professors WHERE university_id = ?',
      [req.params.universityId]
    );
    
    console.log(`Found ${results.length} professors for university ${req.params.universityId}`);
    res.json(results);
  } catch (error) {
    console.error('Error fetching university professors:', error);
    res.status(500).json({ error: 'Failed to fetch professors' });
  }
});

// POST new professor
app.post('/api/professors', async (req, res) => {
  console.log('POST /api/professors - Creating new professor:', req.body);
  try {
    const professor = {
      name: req.body.name,
      university_id: req.body.universityId
    };

    const [result] = await pool.query(
      'INSERT INTO professors SET ?',
      professor
    );
    
    console.log(`Created professor with ID ${result.insertId}`);
    res.status(201).json({ 
      id: result.insertId, 
      ...professor 
    });
  } catch (error) {
    console.error('Error creating professor:', error);
    res.status(500).json({ error: 'Failed to create professor' });
  }
});

// POST new review
app.post('/api/review', async (req, res) => {
  console.log('POST /api/review - Creating new review:', req.body);
  try {
    let course_id = req.body.courseId;
    if (!req.body.courseId || !Number.isInteger(parseInt(req.body.courseId))) {
      course_id = req.body.courseId.id
    }
    const review = {
      course_id: course_id,
      user_id: req.body.userId,
      professor_id: req.body.professorId,
      difficulty: req.body.difficulty,
      workload: req.body.hoursPerWeek,
      usefulness: req.body.usefulness,
      course_comments: req.body.courseComments,
      general_comments: req.body.comments,
      created_at: new Date()
    };

    const [result] = await pool.query(
      'INSERT INTO reviews SET ?',
      review
    );

    console.log(`Created review with ID ${result.insertId}`);
    res.status(201).json({ id: result.insertId, ...review });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ error: 'Failed to create review' });
  }
});

// PUT update user university
app.put('/api/users/:id/university', async (req, res) => {
  try {
    const { universityId } = req.body;
    await pool.query(
      'UPDATE users SET university_id = ? WHERE id = ?',
      [universityId, req.params.id]
    );
    res.json({ message: 'University updated successfully' });
  } catch (error) {
    console.error('Error updating user university:', error);
    res.status(500).json({ error: 'Failed to update university' });
  }
});

// Add this new endpoint with the other routes
app.get('/api/course/:courseId/reviews', async (req, res) => {
  console.log(`GET /api/course/${req.params.courseId}/reviews - Fetching reviews for course`);
  try {
    const [results] = await pool.query(`
      SELECT 
        r.*,
        u.name as user_name,
        p.name as professor_name
      FROM reviews r
      LEFT JOIN users u ON r.user_id = u.id
      LEFT JOIN professors p ON r.professor_id = p.id
      WHERE r.course_id = ?
      ORDER BY r.created_at DESC
    `, [req.params.courseId]);
    
    console.log(`Found ${results.length} reviews for course ${req.params.courseId}`);
    res.json(results);
  } catch (error) {
    console.error('Error fetching course reviews:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});
