import { Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../pages/auth/AuthContext";

function NavigationMenu() {
  const { isAuthenticated, logout } = useAuth();

  console.log(isAuthenticated);

  return (
    <Navbar bg="dark" expand="lg" variant="dark">
      <div className="container">
        <Navbar.Brand>Национальный мусорный проект</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarNav" />
        <Navbar.Collapse id="navbarNav">
          <Nav className="ml-auto">
            <Nav.Item>
              <Link className="nav-link" to="/panel">
                Moderation Panel
              </Link>
            </Nav.Item>
            {!isAuthenticated ? (
              <>
                <Nav.Item>
                  <Link className="nav-link" to="/register">
                    Register
                  </Link>
                </Nav.Item>
                <Nav.Item>
                  <Link className="nav-link" to="/login">
                    Login
                  </Link>
                </Nav.Item>
              </>
            ) : (
              <Nav.Item>
                <Link className="nav-link" to="/" onClick={() => logout()}>
                  Logout
                </Link>
              </Nav.Item>
            )}
          </Nav>
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
}

export default NavigationMenu;
