import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faUniversity } from '@fortawesome/free-solid-svg-icons'
import UserForm from "../../components/Authentication/UserForm"
import InstitutionForm from "../../components/Authentication/InstitutionForm"

function Register(props){

  const [ showmodal, setShowModal ] = useState(false)
  const [ registrationType, setRegistrationType ] = useState("user")

  const modal = () => {
    return (
      <Modal
        {...props}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        show={showmodal}
        onHide={() => setShowModal(false)}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header style={{border:'none'}} closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Dziękujemy za rejestrację
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{border:'none'}}>
          <p>Wysłaliśmy wiadomość z linkiem aktywacyjnym na podany adres email w celu weryfikacji.</p>
        </Modal.Body>
        <Modal.Footer className="align-left" style={{border:'none'}}>
          <a href="../../login" style={{float:'right'}} id="signup"><Button className="rounded-pill">Wróć do panelu logowania</Button></a>
        </Modal.Footer>
      </Modal>
    )
  }
  
  // Logo nad formularzem
  //<Form.Group className="text-center pb-4 container-fluid">
  //  <Image src={Logo} style={{width:'50%', padding:'1rem'}}/>
  //</Form.Group>

  return (
    <>
      { modal() }
      <div className="container h-100">
        <div className="row h-100 justify-content-center align-items-center">
          <Form className="col-md-6">
            <Form.Group className="text-center pb-4 container-fluid">
              <div className="row align-items-start">
                <div className="col" style={{paddingTop:'1rem', paddingBottom:'1rem',borderBottom: registrationType === "user" ? "0.5rem solid dodgerblue" : "0.5rem solid transparent"}}>
                  <FontAwesomeIcon 
                    style={{fontSize: 'min(25vw, 900%)'}} 
                    color={registrationType === "user" ? "dodgerblue" : "silver"} 
                    icon={faUser} 
                    onClick={ () => setRegistrationType('user') } 
                  />
                </div>
                <div className="col" style={{paddingTop:'1rem', paddingBottom:'1rem',borderBottom: registrationType === "intitution" ? "0.5rem solid dodgerblue" : "0.5rem solid transparent"}}>
                  <FontAwesomeIcon 
                    style={{fontSize: 'min(25vw, 900%)'}} 
                    color={registrationType === "intitution" ? "dodgerblue" : "silver"} 
                    icon={faUniversity} 
                    onClick={ () => setRegistrationType('intitution') } 
                  />
                </div>
              </div>
            </Form.Group>
            {registrationType === "user" && <UserForm setShowModal={setShowModal} />}
            {registrationType === "intitution" && <InstitutionForm setShowModal={setShowModal} />}
          </Form>
        </div>
      </div>
    </>
  )
}

export default Register;