import React, { useState, useEffect } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import InstitutionDataSettings from "../../components/Settings/InstitutionDataSettings";
import EmailSettigns from "../../components/Settings/EmailSettigns";
import PasswordSettings from "../../components/Settings/PasswordSettings";
import UserDataSettings from "../../components/Settings/UserDataSettings";

function Settings(props) {
  const [key, setKey] = useState("data");
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

  return (
    <>
      <Tabs
        defaultActiveKey="profile"
        id="uncontrolled-tab-example"
        className="mb-3"
        activeKey={key}
        onSelect={(k) => setKey(k)}
      >
        <Tab eventKey="data" title="Dane">
          {user.role === "business" && <InstitutionDataSettings />}
          {user.role !== "business" && <UserDataSettings />}
        </Tab>
        <Tab eventKey="email" title="E-mail">
          <EmailSettigns />
        </Tab>
        <Tab eventKey="passowrd" title="Hasło">
          <PasswordSettings />
        </Tab>
      </Tabs>
    </>
  );
}

export default Settings;
