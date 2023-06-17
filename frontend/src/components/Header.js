import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";

function Header() {
  const [user, setUser] = useState({});

  useEffect(() => {
    const userData =
      localStorage.getItem("user") === "undefined"
        ? "{}"
        : localStorage.getItem("user");
    setUser(JSON.parse(userData));

    const checkIfAuthenticated = async () => {
      await fetch("http://localhost:8000/api/auth/isauthenticated", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: localStorage.getItem("token")
            ? "Token " + localStorage.getItem("token")
            : null,
        },
      }).then(async (res) => {
        if (res.status === 401) {
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          window.location = "/";
        }
      });
    };
    if (
      localStorage.getItem("user") !== "undefined" &&
      localStorage.getItem("user") !== "{}" &&
      localStorage.getItem("user")
    ) {
      checkIfAuthenticated();
    }
  }, []);

  const logout = async () => {
    await fetch("http://localhost:8000/api/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: localStorage.getItem("token")
          ? "Token " + localStorage.getItem("token")
          : null,
      },
    }).then(async (res) => {
      if (res.status === 204) {
        setUser({});
        localStorage.removeItem("user");
        window.location = "/";
      }
    });
  };

  return (
    <>
      <Navbar bg="light" variant="light">
        <Container>
          <Navbar.Brand href="#home">
            <img
              alt=""
              src="/logo.svg"
              width="30"
              height="30"
              className="d-inline-block align-top"
            />{" "}
            Projekt PZ-2
          </Navbar.Brand>
          <Navbar.Collapse className="justify-content-end">
            <Nav className="me-auto">
              <Nav.Link href="/#about">O projekcie</Nav.Link>
              <Nav.Link href="/#features">Możliwości</Nav.Link>
              <Nav.Link href="/#join">Dołącz już teraz!</Nav.Link>
              {user?.email && <Nav.Link href="/dashboard">Dashboard</Nav.Link>}
            </Nav>
            <Navbar.Text>
              {!user?.email && <a href="/login">Zaloguj</a>}
              {user?.email}
            </Navbar.Text>
            <Navbar.Text>
              {user?.email && (
                <Button
                  className="rounded-pill"
                  style={{ marginLeft: "1.5rem" }}
                  type="submit"
                  onClick={logout}
                >
                  Wyloguj
                </Button>
              )}
            </Navbar.Text>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default Header;
