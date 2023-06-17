import {useEffect, useState} from 'react';
import { useParams } from "react-router-dom";

function Activate(){
  const { code } = useParams();
  const [active, setActive] = useState(false)
  console.log(code)

  useEffect(() => {
    fetch(`http://localhost:8000/api/auth/users-activation/?code=${code}`, {
      method: 'GET',
      headers: {'Content-Type': 'application/json', "Accept": "application/json",},
    }).then(async (res) => {
      if(res.status === 200) {
        setActive(true)
        setTimeout(() => {
          window.location = "/login"
        }, 5000)
      }
    })
  }, [code])
  
  return (
    <>
      <div className="container h-100">
        <div className="row h-100 justify-content-center align-items-center">
          {active && <p>Towje konto zostało aktywowane. Za chwilę nastąpi przekierowanie</p>}
        </div>
      </div>
    </>
  )
}

export default Activate;
