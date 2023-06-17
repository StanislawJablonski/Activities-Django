import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
// import { useGlobalEvent } from "beautiful-react-hooks";
import { getMonthName, getWeekDayName } from "../../helpers/helpers";
import { Modal } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Alert } from "react-bootstrap";
import Nav from "react-bootstrap/Nav";

function DayCalendar(props) {
  const today = new Date();
  const [activities, setActivities] = useState([]);
  const [showmodal, setShowModal] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState({});
  const [selectedDay, setSelectedDay] = useState({});

  let getData = true;
  const getActivities = async ({ start, end }) => {
    await fetch(
      `http://localhost:8000/api/activity?start=${start}&end=${end}`,
      {
        method: "get",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: localStorage.getItem("token")
            ? "Token " + localStorage.getItem("token")
            : null,
        },
      }
    ).then(async (res) => {
      const data = await res.json();
      if (res.status === 200) {
        setActivities(data);
        console.log(data);
      }
      getData = false;
    });
  };

  useEffect(() => {
    async function fetchData() {
      if (!activities.length && getData) {
        await getActivities({
          start: today.toISOString().slice(0, 10),
          end: today.toISOString().slice(0, 10),
        });
      }
    }
    fetchData();
  });
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
  const Day = (date) => {
    // const opacity = today.getMonth() === date.date.month ? 1 : 0.5;

    const events = [];
    console.log("day");
    console.log(activities);
    if (activities.length) {
      activities.forEach((el, idx) =>
        events.push(
          <div
            key={idx}
            onClick={() => {
              setShowModal(true);
              setSelectedDay(el);
            }}
            className="rounded my-1 p-2 bg-primary text-white"
          >
            <b>{el.name}</b>
            <br />
            <i>{el.leader}</i>
            <br />
            <font size="2">OD</font> {el.start_time.slice(0, -3)}{" "}
            <font size="2">DO</font> {el.end_time.slice(0, -3)}
          </div>
        )
      );
    }
    console.log(activities);
    return events;
  };
  const CalendarMenu = () => {
    const [windowsize] = useState({
      width: window.innerWidth,
      height: window.innerHeight,
    });
    return (
      <div
        id="CalendarMenu"
        className="w-100 shadow"
        style={{ zIndex: "1001" }}
      >
        <div
          className="bg-primary text-white text-center row shadow"
          style={{ height: "3rem", marginLeft: "0", marginRight: "0" }}
        >
          <span className="col my-auto">
            {new Date().getDate()}{" "}
            {getWeekDayName(windowsize.width, new Date().getDate() % 7)},{" "}
            {getMonthName()} {new Date().getFullYear()}
          </span>
        </div>
      </div>
    );
  };

  const send = () => {
    fetch("http://localhost:8000/api/notification", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: localStorage.getItem("token")
          ? "Token " + localStorage.getItem("token")
          : null,
      },
      body: JSON.stringify({
        message: message,
        activity: selectedDay,
        ...user,
      }),
    }).then(async (res) => {
      if (res.status === 400) {
      } else {
        setMessage("");
        setSuccess(true);
        setTimeout(() => {
          setShowModal(false);
          setSuccess(false);
        }, 2000);
      }
    });
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
            Wyślij wiadomość
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ border: "none" }}>
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <Form.Label>Wiadomość</Form.Label>
            <Form.Control
              onChange={(e) => setMessage(e.target.value)}
              as="textarea"
              rows={3}
            />
          </Form.Group>
          <Alert variant={"success"} show={!!success} type="invalid">
            Wiadomość została wysłana
          </Alert>
        </Modal.Body>
        <Modal.Footer className="align-left" style={{ border: "none" }}>
          <Button onClick={send} className="rounded-pill">
            Wyślij
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };
  return (
    <>
      <Nav fill variant="tabs" defaultActiveKey="/dashboard/dayCalendar">
        <Nav.Item>
          <Nav.Link href="/dashboard/dayCalendar">Dzień</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="link-1" href="/dashboard/weekCalendar">
            Tydzień
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="link-2" href="/dashboard/monthCalendar">
            Miesiąc
          </Nav.Link>
        </Nav.Item>
      </Nav>
      {modal()}
      <CalendarMenu />
      <Container
        style={{
          minHeight: "calc(100% - 3rem + 1px)",
          minWidth: "100%",
          display: "grid",
          padding: 0,
          gridTemplateColumns: "1fr",
          gridTemplateRows: "1fr",
        }}
        fluid
      >
        <div style={{ border: "1px solid #eee", padding: "0.25rem" }}>
          {activities?.length && <Day />}
        </div>
      </Container>
    </>
  );
}

export default DayCalendar;
