import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Alert, InputGroup } from "react-bootstrap";

function InstitutionDataSettings(props) {
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
    const { username, phone, category } = form;
    const newErrors = {};

    let formValidated = true;

    if (username?.length < 2) {
      formValidated = false;
      newErrors.username = "Podano za krótką nazwę!";
    }
    if (!username || username === "") {
      formValidated = false;
      newErrors.username = "Podaj nazwę!";
    }

    if (!category || category === "") {
      formValidated = false;
      newErrors.category = "Wybierz kategorię!";
    }

    if (
      phone &&
      phone !== "" &&
      !/^(?<!\w)(\(?(\+|00)?48\)?)?[ -]?\d{3}[ -]?\d{3}[ -]?\d{3}(?!\w)/gm.test(
        phone
      )
    ) {
      formValidated = false;
      newErrors.phone = "Zły format telefonu!";
    }

    if (formValidated) {
      await fetch("http://localhost:8000/api/auth/datachange", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ ...form, email: user.email }),
      }).then(async (res) => {
        if (res.status === 400) {
          newErrors.requestErrors = "Coś poszłonie tak spróbuj ponownie";
        } else {
          newErrors.success = true;
          setTimeout(() => {
            newErrors.success = false;
            setForm({
              username: "",
              phone: "",
              category: "",
            });
          }, 3000);
        }
      });
    }

    setErrors(newErrors);

    return newErrors;
  };

  return (
    <>
      <Form.Group>
        <Form.Label>Nazwa</Form.Label>
        <InputGroup className="mb-3">
          <Form.Control
            value={form.username}
            type="text"
            name="username"
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            isInvalid={!!errors.username}
          />
          <Form.Control.Feedback type="invalid">
            {errors.username}
          </Form.Control.Feedback>
        </InputGroup>
      </Form.Group>
      <Form.Group>
        <Form.Label>Numer telefonu</Form.Label>
        <InputGroup className="mb-3">
          <Form.Control
            value={form.phone}
            type="tel"
            name="phone"
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            isInvalid={!!errors.phone}
          />
          <Form.Control.Feedback type="invalid">
            {errors.phone}
          </Form.Control.Feedback>
        </InputGroup>
      </Form.Group>
      <Form.Group>
        <Form.Label>Kategoria</Form.Label>
        <Form.Select
          name="category"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          isInvalid={!!errors.category}
          defaultValue="init"
        >
          <option disabled value="init" hidden>
            Wybierz z listy...
          </option>
          <option value="Szkoła języków obych">Szkoła języków obych</option>
          <option value="Fitness">Fitness</option>
          <option value="Siłownia">Siłownia</option>
          <option value="Szkoła muzyczna">Szkoła muzyczna</option>
          <option value="Inna">Inna</option>
        </Form.Select>
        <Form.Control.Feedback type="invalid">
          {errors.category}
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group>
        <Alert variant={"danger"} show={!!errors.requestErrors} type="invalid">
          {errors.requestErrors}
        </Alert>
        <Alert variant={"success"} show={!!errors.success} type="invalid">
          Pomyślnie zmieniono dane
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

export default InstitutionDataSettings;
