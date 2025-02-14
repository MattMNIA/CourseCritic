import React, { useState } from 'react';

const ViewTest = () => {
    // Sample data - in a real application, this would come from an API or database
    const [courses] = useState([
        {
            id: 1,
            school: 'Iowa State University',
            courseCode: 'COM S 227',
            courseName: 'Introduction to Object-oriented Programming',
            professor: 'Dr. Smith',
            rating: 4.5,
            difficulty: 3.2
        },
        {
            id: 2,
            school: 'Iowa State University',
            courseCode: 'COM S 228',
            courseName: 'Introduction to Data Structures',
            professor: 'Dr. Johnson',
            rating: 4.2,
            difficulty: 3.8
        },
        // Add more courses as needed
    ]);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Course List</h1>
            <div className="grid gap-4">
                {courses.map(course => (
                    <div key={course.id} className="border rounded-lg p-4 shadow-sm">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-xl font-semibold">{course.courseCode}</h2>
                                <h3 className="text-lg text-gray-700">{course.courseName}</h3>
                                <p className="text-gray-600">{course.school}</p>
                                <p className="text-gray-600">Professor: {course.professor}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-green-600">Rating: {course.rating}/5.0</p>
                                <p className="text-blue-600">Difficulty: {course.difficulty}/5.0</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ViewTest;