import "./Dashboard.css";
import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";

function Dashboard() {
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
      <div className="d-flex position-relative main">
        <div className="drower position-absolute">
          <ul>
            {user?.role === "business" && (
              <li>
                <a href="/dashboard/createactivity">Utwórz zajęcia</a>
              </li>
            )}
            {user?.role === "user" && (
              <li>
                <a href="/dashboard/takepartinactivity">
                  Zapisz się na zajęcia
                </a>
              </li>
            )}
            <li>
              <a href="/dashboard/weekCalendar">Kalendarz</a>
            </li>
            <li>
              <a href="/dashboard/settings">Ustawienia</a>
            </li>
          </ul>
        </div>
        <div
          style={{
            height: "100%",
            width: "100%",
            padding: "50px 50px 50px 100px",
          }}
        >
          <div className="panel">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
