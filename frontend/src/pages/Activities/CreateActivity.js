import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Alert, InputGroup, Modal } from "react-bootstrap";

function CreateActivity(props) {
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const [showmodal, setShowModal] = useState(false);
  const [activityName, setActivityName] = useState("");

  const validation = async (e) => {
    e.preventDefault();
    const {
      activityname,
      date,
      starttime,
      endtime,
      periodicity,
      leader,
      amount,
    } = form;
    const newErrors = {};
    console.log("testast");

    let formValidated = true;

    if (!/^[A-ZĘÓŁŚĄŻŹĆŃ]+[a-zA-ZęółśążźćńĘÓŁŚĄŻŹĆŃ]{3,}$/.test(activityname)) {
      formValidated = false;
      newErrors.activityname =
        "Podano błędną nazwę! Nazwa powinna zaczynać się z wielkiej litery i nie zawierać cyfr.";
    }
    if (!activityname || activityname === "") {
      formValidated = false;
      newErrors.activityname = "Podaj nazwę!";
    }
    if (newErrors.activityname === "") {
      setActivityName(activityname);
    }

    if (
      !/^(?:20)[0-9]{2}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-9])|(?:(?!02)(?:0[1-9]|1[0-2])-(?:30))|(?:(?:0[13578]|1[02])-31))$/.test(
        date
      )
    ) {
      formValidated = false;
      newErrors.date =
        "Podano błędną datę! Data musi być podana w formacie RRRR-MM-DD.";
    }
    if (!date || date === "") {
      formValidated = false;
      newErrors.date = "Podaj datę!";
    }

    const tempdate = new Date();
    const today = new Date(
      tempdate.getFullYear(),
      tempdate.getMonth(),
      tempdate.getDate()
    );

    if (Date.parse(date) < Date.parse(today)) {
      formValidated = false;
      newErrors.date =
        "Podano błędną datę! Data musi być conajmniej dzisiejsza.";
    }

    if (!/^(?:0[1-9]|1[0-9]|2[0-4]):(?:[0-5])[0-9]$/.test(starttime)) {
      formValidated = false;
      newErrors.starttime =
        "Podano błędną godzinę rozpoczęcia! Godzina musi być podana w formacie HH:MM.";
    }
    if (!starttime || starttime === "") {
      formValidated = false;
      newErrors.starttime = "Podaj godzinę rozpoczęcia!";
    }
    if (!/^(?:0[1-9]|1[0-9]|2[0-4]):(?:[0-5])[0-9]$/.test(endtime)) {
      formValidated = false;
      newErrors.endtime =
        "Podano błędną godzinę zakończenia! Godzina musi być podana w formacie HH:MM.";
    }
    if (!endtime || endtime === "") {
      formValidated = false;
      newErrors.endtime = "Podaj godzinę zakończenia!";
    }
    if (starttime > endtime) {
      formValidated = false;
      newErrors.endtime =
        "Podano błędną godzinę zakończenia! Godzina musi być późniejsza od godziny rozpoczęcia.";
    }

    if (!periodicity || periodicity === "") {
      formValidated = false;
      newErrors.periodicity = "Podaj cykliczność!";
    }

    if (!leader || leader === "") {
      formValidated = false;
      newErrors.leader = "Wybierz prowadzącego!";
    }

    if (amount <= 0 || amount > 1000) {
      formValidated = false;
      newErrors.leader = "Możliwa ilość zajęć: 1 - 1000";
    }

    // Rejestracja
    newErrors.register = undefined;
    if (formValidated) {
      await fetch("http://localhost:8000/api/activity", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: localStorage.getItem("token")
            ? "Token " + localStorage.getItem("token")
            : null,
        },
        body: JSON.stringify({ ...form }),
      }).then(async (res) => {
        if (res.status === 204) {
          setForm({});
          setShowModal(true);
        }
      });
    }
    console.log(newErrors);
    setErrors(newErrors);
    return newErrors;
  };

  const modal = () => {
    return (
      <Modal
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        show={showmodal}
        onHide={() => setShowModal(false)}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header style={{ border: "none" }} closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Poprawinie dodano zajęcia
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ border: "none" }}>
          <p>Zajęcia o nazwie {activityName} zostały utowrzone</p>
        </Modal.Body>
        <Modal.Footer className="align-left" style={{ border: "none" }}>
          <Button className="rounded-pill" onClick={() => setShowModal(false)}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  return (
    <>
      {modal()}
      <div
        className="container h-100"
        style={{ top: "3.5rem", minHeight: "calc(100%-3.5rem)" }}
      >
        <div className="row h-100 justify-content-center align-items-center">
          <Form className="col-md-6">
            <Form.Group>
              <h5>TWORZENIE ZAJĘĆ</h5>
              <hr className="horizontal-rule" />
            </Form.Group>
            <Form.Group>
              <Form.Label>Podaj nazwę zajęć</Form.Label>
              <InputGroup className="mb-3">
                <Form.Control
                  type="text"
                  name="activityname"
                  onChange={(e) =>
                    setForm({ ...form, activityname: e.target.value })
                  }
                  isInvalid={!!errors.activityname}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.activityname}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
            <Form.Group>
              <Form.Label>Podaj datę zajęć</Form.Label>
              <InputGroup className="mb-3">
                <Form.Control
                  type="date"
                  name="date"
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  isInvalid={!!errors.date}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.date}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
            <Form.Group>
              <Form.Label>Podaj godzinę rozpoczęcia zajęć </Form.Label>
              <InputGroup className="mb-3">
                <Form.Control
                  type="text"
                  name="starttime"
                  onChange={(e) =>
                    setForm({ ...form, starttime: e.target.value })
                  }
                  isInvalid={!!errors.starttime}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.starttime}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
            <Form.Group>
              <Form.Label>Podaj godzinę zakończenia zajęć </Form.Label>
              <InputGroup className="mb-3">
                <Form.Control
                  type="text"
                  name="endtime"
                  onChange={(e) =>
                    setForm({ ...form, endtime: e.target.value })
                  }
                  isInvalid={!!errors.endtime}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.endtime}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
            <Form.Group>
              <Form.Label>Podaj cykliczność zajęć</Form.Label>
              <Form.Control
                as="select"
                custom
                type="select"
                name="periodicity"
                onChange={(e) =>
                  setForm({ ...form, periodicity: e.target.value })
                }
                isInvalid={!!errors.periodicity}
              >
                <option disabled selected hidden>
                  Wybierz z listy...
                </option>
                <option value="Brak">Brak</option>
                <option value="Codziennie">Codziennie</option>
                <option value="Co tydzień">Co tydzień</option>
                <option value="Co dwa tygodnie">Co dwa tygodnie</option>
                <option value="Co miesiąc">Co miesiąc</option>
              </Form.Control>
              <Form.Control.Feedback type="invalid">
                {errors.periodicity}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
              <Form.Label>Podaj ilość zajęć</Form.Label>
              <InputGroup className="mb-3">
                <Form.Control
                  type="number"
                  name="amount"
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  isInvalid={!!errors.amount}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.amount}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
            <Form.Group>
              <Form.Label>Podaj prowadzącego</Form.Label>
              <InputGroup className="mb-3">
                <Form.Control
                  type="text"
                  name="leader"
                  onChange={(e) => setForm({ ...form, leader: e.target.value })}
                  isInvalid={!!errors.leader}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.leader}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
            <Form.Group>
              <Alert variant={"danger"} show={!!errors.register} type="invalid">
                {errors.register}
              </Alert>
            </Form.Group>
            <Form.Group className="text-center pt-4">
              <Button
                className="rounded-pill col-6"
                type="submit"
                onClick={validation}
              >
                Stwórz zajęcia
              </Button>
            </Form.Group>
          </Form>
        </div>
      </div>
    </>
  );
}

export default CreateActivity;
