import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
// import { useGlobalEvent } from "beautiful-react-hooks";
import { getMonthName, getWeekDayName } from "../../helpers/helpers";
import { Modal } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Alert } from "react-bootstrap";
import Nav from "react-bootstrap/Nav";

function MonthCalendar(props) {
  const [activities, setActivities] = useState([]);
  const [showmodal, setShowModal] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState({});
  const [selectedDay, setSelectedDay] = useState({});

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
      }
      getData = false;
    });
  };
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
  const [monthdays, setMonthDays] = useState([]);
  const [windowsize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  let getData = true;
  useEffect(() => {
    const prepareCalendar = async () => {
      let today = new Date();
      // Pobieramy pierwszy dzień miesiaca
      let monthStart = new Date(today.getFullYear(), today.getMonth());
      // Pobieramy index pierwszego dnia miesiąca (odejmujemy 1 aby zaczynac od poniedziałku)
      let monthStartDayIndex = monthStart.getDay() - 1;
      // will fill with sub arrays for each week
      let weeksArray = [];
      let week = 1;

      // Ustawiamy datę rozpoczęcia miesiąca
      var calendarStartDay = new Date(monthStart);
      // Ustawiamy datę na niezielę tygodnia poprzedzającego ten w którym jest dzień rozpoczynający nasz miesiąc
      calendarStartDay.setDate(monthStart.getDate() - monthStartDayIndex);
      calendarStartDay.setHours(3);
      // Budujemy tablicę tygodni a w nich numery dni miesiąca
      var dayCount = 0;
      while (week < 7) {
        if (dayCount === 0) {
          weeksArray.push([]);
        }
        weeksArray[week - 1].push({
          number: calendarStartDay.getDate(),
          month: calendarStartDay.getMonth(),
          day: dayCount,
          date: calendarStartDay.toISOString().slice(0, 10),
        });
        dayCount++;
        calendarStartDay.setDate(calendarStartDay.getDate() + 1);
        if (dayCount === 7) {
          week++;
          dayCount = 0;
        }
      }

      if (!activities.length && getData) {
        await getActivities({
          start: weeksArray[0][0].date,
          end: weeksArray[weeksArray.length - 1][6].date,
        });
      }
      // Zwracamy przygotowaną tablicę
      setMonthDays(weeksArray);
      return weeksArray;
    };
    prepareCalendar();
  }, []);

  const Day = ({ date }) => {
    let today = new Date();
    // Ustawienie dzi poza zakresem berzącego miesiąca na półprzezroczyste
    let opacity = today.getMonth() === date.month ? 1 : 0.5;

    const events = [];
    activities
      .filter((el) => el.date === date.date)
      .forEach((el, idx) =>
        events.push(
          <div
            key={idx}
            onClick={() => {
              setShowModal(true);
              setSelectedDay(el);
            }}
            className="rounded my-1 p-1 bg-primary text-white text-overflow"
          >
            {el.name}
          </div>
        )
      );
    return (
      <div style={{ opacity: opacity }}>
        <font className={date.day > 4 ? "text-danger" : "text-dark"}>
          <b>{date.number}</b>
        </font>
        {events}
      </div>
    );
  };

  const CalendarMenu = () => {
    return (
      <div className="w-100 shadow" style={{ zIndex: "999" }}>
        <div
          className="bg-primary text-white text-center row"
          style={{ height: "3rem", marginLeft: "0", marginRight: "0" }}
        >
          <span className="col my-auto">
            {getMonthName()} {new Date().getFullYear()}
          </span>
        </div>
        <Container
          style={{
            width: "100%",
            display: "grid",
            overflow: "hidden",
            padding: "0",
            gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr 1fr",
            gridTemplateRows: "3rem",
          }}
          className="shadow"
          fluid
        >
          <div className="bg-dark w-100 mx-auto text-white text-center row overflow-hidden">
            <div className="col my-auto">
              {getWeekDayName(windowsize.width, 0)}
            </div>
          </div>
          <div className="bg-dark w-100 mx-auto text-white text-center row overflow-hidden">
            <div className="col my-auto">
              {getWeekDayName(windowsize.width, 1)}
            </div>
          </div>
          <div className="bg-dark w-100 mx-auto text-white text-center row overflow-hidden">
            <div className="col my-auto">
              {getWeekDayName(windowsize.width, 2)}
            </div>
          </div>
          <div className="bg-dark w-100 mx-auto text-white text-center row overflow-hidden">
            <div className="col my-auto">
              {getWeekDayName(windowsize.width, 3)}
            </div>
          </div>
          <div className="bg-dark w-100 mx-auto text-white text-center row overflow-hidden">
            <div className="col my-auto">
              {getWeekDayName(windowsize.width, 4)}
            </div>
          </div>
          <div className="bg-danger w-100 mx-auto text-white text-center row overflow-hidden">
            <div className="col my-auto">
              {getWeekDayName(windowsize.width, 5)}
            </div>
          </div>
          <div className="bg-danger w-100 mx-auto text-white text-center row overflow-hidden">
            <div className="col my-auto">
              {getWeekDayName(windowsize.width, 6)}
            </div>
          </div>
        </Container>
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
      <Nav fill variant="tabs" defaultActiveKey="/dashboard/monthCalendar">
        <Nav.Item>
          <Nav.Link eventKey="link-2" href="/dashboard/dayCalendar">
            Dzień
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="link-1" href="/dashboard/weekCalendar">
            Tydzień
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="/dashboard/monthCalendar">Miesiąc</Nav.Link>
        </Nav.Item>
      </Nav>
      {modal()}
      <CalendarMenu />
      <Container
        style={{
          minHeight: "calc(100% - 6rem + 1px)",
          minWidth: "100%",
          display: "grid",
          padding: 0,
          gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr 1fr",
          gridTemplateRows: "1fr 1fr 1fr 1fr 1fr 1fr ",
        }}
        fluid
      >
        {monthdays?.map((week) => {
          return week.map((day, index) => {
            // Zaznaczenie dzisiejszego dnia
            let today = new Date();
            let dateToCheck = new Date(
              today.getFullYear(),
              day.month,
              day.number,
              today.getHours(),
              today.getMinutes(),
              today.getSeconds(),
              today.getMilliseconds()
            );
            let backgroundToSet =
              today.getTime() === dateToCheck.getTime()
                ? "lightblue"
                : "transparent";
            // Rysowanie dni
            return (
              <div
                style={{
                  border: "1px solid #eee",
                  padding: "0.25rem",
                  backgroundColor: backgroundToSet,
                }}
                key={index}
              >
                <Day date={day} />
              </div>
            );
          });
        })}
      </Container>
    </>
  );
}

export default MonthCalendar;
