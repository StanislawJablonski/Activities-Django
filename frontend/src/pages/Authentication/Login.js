import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Alert } from 'react-bootstrap';

function Login(){

  const rememberme = false
  const [ errors, setErrors ] = useState({})
  const [ form, setForm ] = useState({})

  const validation = async () => {
    const { email, password } = form
    const newErrors = {}

    let formValidated = true

    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      formValidated = false
      newErrors.email = 'Podano zły format! \'example@mail.com\''
    }
    if ( !email || email === '' ) {
      formValidated = false
      newErrors.email = 'Podaj adres email!'
    }

    if ( !password || password === '' ){
      formValidated = false  
      newErrors.password = 'Podaj hasło!'
    } else if(password.length < 8){
      formValidated = false  
      newErrors.password = 'Podano zakrótkie hasło!'
    }

    if (formValidated){
      await fetch("http://localhost:8000/api/auth/login", {
        method: 'POST',
        headers: {'Content-Type': 'application/json', "Accept": "application/json",},
        body: JSON.stringify(form) 
      }).then(async (res) => {
        const data = await res.json();
        if(res.status === 400) {
          newErrors.login = data.non_field_errors[0]
        } else {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          window.location = "/"
        }
      })

    }

    return newErrors
  }

    // Metoda wykonywania po przycisnięciu 'Zaloguj'
    const handleSubmit = async (e) => {
      e.preventDefault()
  
      // Logowanie
      
    
      // Ponowna weryfikacja błędów
      const newErrors = await validation()
      setErrors(newErrors)
    }
  
  return (
    <>
      <div className="container h-100">
        <div className="row h-100 justify-content-center align-items-center">
          <Form className="col-md-6">
            <Form.Group>
              <Form.Label>Adres Email</Form.Label>
              <Form.Control 
                type='text' name="email"
                onChange={ e => setForm({...form, email: e.target.value })}
                isInvalid={ !!errors.username }
              />
              <Form.Control.Feedback type='invalid'>{ errors.username }</Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
              <Form.Label>Hasło</Form.Label>
              <Form.Control 
                type='password' name="password"
                onChange={ e => setForm({...form, password: e.target.value })}
                isInvalid={ !!errors.password }
              />
              <Form.Control.Feedback type='invalid'>{ errors.password }</Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
              <Alert variant={'danger'} show={ !!errors.login } type='invalid'>{ errors.login }</Alert>
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Check type="checkbox" label="Zapamiętaj mnie!" onChange={ e => !rememberme }/>
            </Form.Group>
            <Form.Group className="text-center mt-3">
              <Button className="rounded-pill col-6" type='submit' onClick={ handleSubmit }>Zaloguj</Button>
            </Form.Group>
            <Form.Group className="text-center">
              Nie posiadasz konta? <a href="../register" id="signup">Zarejestruj się</a>
            </Form.Group>
          </Form>
        </div>
      </div>
    </>
  )
}

export default Login;
