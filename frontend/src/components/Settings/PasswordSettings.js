import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Alert, InputGroup } from "react-bootstrap";

function PasswordSettings(props) {
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({});
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

  const validation = async (e) => {
    e.preventDefault();
    const { newPassword, repassword } = form;
    const newErrors = {};

    let formValidated = true;

    if (!newPassword || newPassword === "") {
      formValidated = false;
      newErrors.password = ["Podaj hasło!"];
    } else {
      const passwordRegexValidations = [];
      if (newPassword.length < 8) {
        passwordRegexValidations.push("Hasło musi zkładać się z 8-u znaków!");
      }
      if (!/\w*[A-ZĘÓŁŚĄŻŹĆŃ]\w*/g.test(newPassword)) {
        passwordRegexValidations.push(
          "Hasło musi zawierać przynajmniej jedną dużą literę!"
        );
      }
      if (!/\w*[0-9]\w*/g.test(newPassword)) {
        passwordRegexValidations.push(
          "Hasło musi zawierać przynajmniej jedną cyfrę!"
        );
      }
      if (passwordRegexValidations.length > 0) {
        formValidated = false;
        newErrors.password = passwordRegexValidations;
      }
    }

    if (newPassword !== repassword) {
      formValidated = false;
      newErrors.repassword = "Hasła się nie zgadzają!";
    }
    if (!repassword || repassword === "") {
      formValidated = false;
      newErrors.repassword = "Powtórz hasło!";
    }
    // Rejestracja
    newErrors.requestErrors = undefined;
    if (formValidated) {
      await fetch("http://localhost:8000/api/auth/passwordchange", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ ...form, email: user.email }),
      }).then(async (res) => {
        const data = await res.json();
        if (res.status === 400) {
          newErrors.requestErrors = data.non_field_errors[0];
        } else {
          newErrors.success = true;
          setTimeout(() => {
            logout();
          }, 3000);
        }
      });
    }

    setErrors(newErrors);

    return newErrors;
  };

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
      <Form.Group>
        <Form.Label>Aktualne hasło</Form.Label>
        <InputGroup className="mb-3">
          <Form.Control
            type="password"
            name="password"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            isInvalid={!!errors.password}
            data-toggle="password"
          />
          <Form.Control.Feedback type="invalid">
            {errors.password}
          </Form.Control.Feedback>
        </InputGroup>
      </Form.Group>
      <Form.Group>
        <Form.Label>Hasło</Form.Label>
        <InputGroup className="mb-3">
          <Form.Control
            type="password"
            name="newPassword"
            onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
            isInvalid={!!errors.newPassword}
            data-toggle="password"
          />
          <Form.Control.Feedback style={{ color: "gray", display: "block" }}>
            Hasło musi składać się z 8-miu znaków i zawierac wielką literę oraz
            cyfrę.
          </Form.Control.Feedback>
          {errors.password?.map((suberror, index) => (
            <Form.Control.Feedback key={index} type="invalid">
              {suberror}
            </Form.Control.Feedback>
          ))}
        </InputGroup>
      </Form.Group>
      <Form.Group>
        <Form.Label>Powtórz hasło</Form.Label>
        <InputGroup className="mb-3">
          <Form.Control
            type="password"
            name="repassword"
            onChange={(e) => setForm({ ...form, repassword: e.target.value })}
            isInvalid={!!errors.repassword}
            data-toggle="repassword"
          />
          <Form.Control.Feedback type="invalid">
            {errors.repassword}
          </Form.Control.Feedback>
        </InputGroup>
      </Form.Group>
      <Form.Group>
        <Alert variant={"danger"} show={!!errors.requestErrors} type="invalid">
          {errors.requestErrors}
        </Alert>
        <Alert variant={"success"} show={!!errors.success} type="invalid">
          Pomyślnienie zmienino hasło za chwilę nastąpi wylogowanie
        </Alert>
      </Form.Group>
      <Form.Group className="text-center pt-4">
        <Button
          className="rounded-pill col-6"
          type="submit"
          onClick={validation}
        >
          Zapisz zmiany
        </Button>
      </Form.Group>
    </>
  );
}

export default PasswordSettings;
