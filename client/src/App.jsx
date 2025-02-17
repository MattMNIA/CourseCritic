import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/home.jsx'
import SearchTest from './pages/search_test.jsx'
import InputTest from './pages/input_test.jsx'
import ViewTest from './pages/view_test.jsx'
import Test from './pages/test_page.jsx'
import ViewCoursesPage from './pages/ViewCoursesPage.jsx';
import CreateCoursePage from './pages/CreateCoursePage.jsx';
import EditCoursePage from './pages/EditCoursePage.jsx';

function App() {
    return (
        <Router>
            <div className="App">
                <nav>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/search">Search</Link></li>
                        <li><Link to="/input">Input</Link></li>
                        <li><Link to="/view">View</Link></li>
                        <li><Link to="/test">Test</Link></li>
                        <li><Link to="/courses">View Courses</Link></li>
                        <li><Link to="/courses/create">Add New Course</Link></li>
                    </ul>
                </nav>

                <Routes>
                    <Route path="/" element={<Home/>}/> 
                    <Route path="/search" element={<SearchTest/>}/> 
                    <Route path="/input" element={<InputTest/>}/> 
                    <Route path="/view" element={<ViewTest/>}/> 
                    <Route path="/test" element={<Test/>}/> 
                    <Route path="/courses" element={<ViewCoursesPage />} />
                    <Route path="/courses/create" element={<CreateCoursePage />} />
                    <Route path="/courses/edit/:id" element={<EditCoursePage />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App