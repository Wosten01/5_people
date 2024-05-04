import { Navbar, Nav, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../pages/auth/AuthContext";
import { Trash } from "react-bootstrap-icons";

function NavigationMenu() {
  const { isAuthenticated, logout } = useAuth();

  console.log(isAuthenticated);

  return (
    <Navbar bg="dark" expand="lg" variant="dark" className="tracking-widest ">
      <div className="container">
        <Navbar.Brand
          className=" font-medium tracking-widest flex gap-3"
          href="/"
        >
          <Container>
            <Trash size={35} className="trash-animation-right" />
          </Container>

          <p className="p-0 m-0">Национальный мусорный проект</p>
          <Container className="px-0.5">
            <Trash size={35} className="trash-animation-left" />
          </Container>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarNav" />
        <Navbar.Collapse id="navbarNav">
          <Nav className="ml-auto">
            <Nav.Item>
              <Link className="nav-link" to="/panel">
                Панель модератора
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
