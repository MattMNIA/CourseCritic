import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaGithub } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-light mt-auto border-top py-4">
      <Container fluid>
        <Row className="align-items-center">
          <Col md={4} className="text-center text-md-start mb-3 mb-md-0">
            <Link to="/" className="text-decoration-none">
              <h5 className="text-primary mb-0">CourseCritic</h5>
            </Link>
            <small className="text-muted">
              © {currentYear} All rights reserved
            </small>
          </Col>
          
          <Col md={4} className="text-center mb-3 mb-md-0">
            <div className="text-muted">
              <small>
                Made with ❤️ for students by students
              </small>
            </div>
          </Col>

          <Col md={4} className="text-center text-md-end">
            <a
              href="https://github.com/mattmnia/coursecritic"
              target="_blank"
              rel="noopener noreferrer"
              className="text-decoration-none text-muted"
            >
              <FaGithub size={24} />
              <small className="ms-2">View on GitHub</small>
            </a>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
