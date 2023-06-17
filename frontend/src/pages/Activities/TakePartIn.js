import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Alert, InputGroup, Modal } from "react-bootstrap";
import ListGroup from "react-bootstrap/ListGroup";

function CreateActivity(props) {
  const [businesses, setBusinesses] = useState([]);
  const [activites, setActivities] = useState([]);
  const [showmodal, setShowModal] = useState(false);
  const [success, setSuccess] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedActivity, setSelectedActivity] = useState({});

  useEffect(() => {
    async function getData() {
      await fetch("http://localhost:8000/api/business", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }).then(async (res) => {
        const data = await res.json();
        if (res.status !== 400) {
          setBusinesses(data);
        }
      });
    }
    getData();
  }, []);

  const getActivities = async (businessId) => {
    await fetch(
      `http://localhost:8000/api/activitybybusinessid?businessId=${businessId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    ).then(async (res) => {
      const data = await res.json();
      if (res.status !== 400) {
        setActivities(data);
      }
    });
  };

  const takePartIn = async () => {
    await fetch(`http://localhost:8000/api/participation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: localStorage.getItem("token")
          ? "Token " + localStorage.getItem("token")
          : null,
      },
      body: JSON.stringify({
        activityId: selectedActivity.id,
      }),
    }).then(async (res) => {
      if (res.status !== 400 && res.status !== 500) {
        setShowModal(false);
        setSelectedActivity({});
        setSuccess(true);
        setActivities([]);
        setTimeout(() => {
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
            Czy napewno chcesz się zapisać na zajęcia {selectedActivity.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Footer className="align-left" style={{ border: "none" }}>
          <Button onClick={takePartIn} className="rounded-pill mr-3">
            Tak
          </Button>
          <Button
            onClick={() => {
              setShowModal(false);
              setSelectedActivity({});
            }}
            className="rounded-pill"
          >
            Nie
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
        <Alert variant={"success"} show={!!success} type="invalid">
          Pomyślnie zapisano na zajęcia
        </Alert>
        <div className="row h-100 justify-content-center">
          <div className="col-6">
            <h4 className="mb-3">Wybierz firmę</h4>
            <InputGroup className="mb-3">
              <Form.Control
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Szukaj"
                aria-label="search"
                aria-describedby="basic-addon1"
              />
            </InputGroup>
            <ListGroup>
              {businesses
                .filter((el) =>
                  el.username.toUpperCase().includes(search.toUpperCase())
                )
                .map((business) => (
                  <ListGroup.Item
                    key={business.id}
                    onClick={() => getActivities(business.id)}
                  >
                    {business.username}
                  </ListGroup.Item>
                ))}
            </ListGroup>
          </div>
          <div className="col-6">
            <h4 style={{ marginBottom: "70px" }}>Wybierz zajęcia</h4>
            <InputGroup className="mb-3">
              <ListGroup>
                {activites.map((activity) => (
                  <ListGroup.Item
                    key={activity.id}
                    onClick={() => {
                      setShowModal(true);
                      setSelectedActivity(activity);
                    }}
                  >
                    {activity.name}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </InputGroup>
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateActivity;
