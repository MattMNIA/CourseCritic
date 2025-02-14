import React from 'react';
// import '../styles/home.css';

const Home = () => {
    return (
        <div className="home-container">
            <h1>Welcome to CourseCritic</h1>
            <div className="welcome-content">
                <p>Find and review courses to help fellow students make informed decisions.</p>
                <div className="cta-section">
                    <button className="primary-button">Browse Courses</button>
                    <button className="secondary-button">Write a Review</button>
                </div>
            </div>
        </div>
    );
};

export default Home;