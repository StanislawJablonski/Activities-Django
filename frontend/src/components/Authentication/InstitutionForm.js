import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Alert, InputGroup } from 'react-bootstrap';
import {axiosApi} from '../../axios'

function InstitutionForm(props){

  const [ errors, setErrors ] = useState({})
  const [ form, setForm ] = useState({})

  const validation = async (e) => {
    e.preventDefault();
    const { username, email, password, repassword, phone, category } = form
    const newErrors = {}

    let formValidated = true

    if(username?.length < 2){
      formValidated = false
      newErrors.username = 'Podano za krótką nazwę!'
    }
    if ( !username || username === '' ) {
      formValidated = false
      newErrors.username = 'Podaj nazwę!'
    }
    
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      formValidated = false
      newErrors.email = 'Podano zły format! \'example@mail.com\''
    }

    if ( !email || email === '' ) {
      formValidated = false
      newErrors.email = 'Podaj adres email!'
    }

    if ( !password || password === '' ) {
      formValidated = false
      newErrors.password = ['Podaj hasło!']
    }
    else{
      const passwordRegexValidations = []
      if(password.length < 8) {
        passwordRegexValidations.push('Hasło musi zkładać się z 8-u znaków!')
      }
      if(!/\w*[A-ZĘÓŁŚĄŻŹĆŃ]\w*/g.test(password)) {
        passwordRegexValidations.push('Hasło musi zawierać przynajmniej jedną dużą literę!')
      }
      if(!/\w*[0-9]\w*/g.test(password)) {
        passwordRegexValidations.push('Hasło musi zawierać przynajmniej jedną cyfrę!')
      }
      if(passwordRegexValidations.length > 0){
        formValidated = false
        newErrors.password = passwordRegexValidations
      }
    }

    if ( password !== repassword ) {
      formValidated = false
      newErrors.repassword = 'Hasła się nie zgadzają!'
    }
    if ( !repassword || repassword === '' ) {
      formValidated = false
      newErrors.repassword = 'Powtórz hasło!'
    }

    if ( !category || category === '' ) {
      formValidated = false
      newErrors.category = 'Wybierz kategorię!'
    }

    if((phone && phone !== '' ) && !/^(?<!\w)(\(?(\+|00)?48\)?)?[ -]?\d{3}[ -]?\d{3}[ -]?\d{3}(?!\w)/gm.test(phone)){
      formValidated = false
      newErrors.phone = 'Zły format telefonu!'
    }
    console.log(form)
    // Rejestracja
    newErrors.register = undefined
    if(formValidated){
      await fetch("http://localhost:8000/api/auth/register", {
        method: 'POST',
        headers: {'Content-Type': 'application/json', "Accept": "application/json",},
        body: JSON.stringify({...form, 
          role: 'business',
          isBusiness: true}) 
      }).then(async (res) => {
        const data = await res.json();
        if(res.status === 400) {
          newErrors.register = data.email[0] === "Istnieje już User z tą wartością pola adres email." ? 
            "Użytkownik o podanym emailu już istnieje" : ""
        } else {
          props.setShowModal(true);
          setForm({})
        }
      })
      await axiosApi.post("/api/auth/register", {
        ...form,
        role: 'business',
        isBusiness: true
      }).then(() => {
        props.setShowModal(true);
        setForm({})
      }).catch(({response}) => {
        console.log(response)
        if(response.data?.email[0] === "user with this email address already exists.") {
          newErrors.register = "Użytkownik o podanym emailu już istnieje"
        }
      })
    }

    setErrors(newErrors)

    return newErrors
  }

  return (
    <>
      <Form.Group>
        <Form.Label>Podaj nazwę</Form.Label>
        <InputGroup className="mb-3">
          <Form.Control 
            type='text' name="username"
            onChange={ e => setForm({...form, username: e.target.value}) }
            isInvalid={ !!errors.username }
          />
          <Form.Control.Feedback type='invalid'>{ errors.username }</Form.Control.Feedback>
        </InputGroup>
      </Form.Group>
      <Form.Group>
        <Form.Label>Adres Email</Form.Label>
        <InputGroup className="mb-3">
          <Form.Control 
            type='email' name="email"
            onChange={ e => setForm({...form, email: e.target.value}) }
            isInvalid={ !!errors.email }
          />
          <Form.Control.Feedback type='invalid'>{ errors.email }</Form.Control.Feedback>
        </InputGroup>
      </Form.Group>
      <Form.Group>
        <Form.Label>Hasło</Form.Label>
        <InputGroup className="mb-3">
          <Form.Control 
            type='password' name="password"
            onChange={ e => setForm({...form, password: e.target.value}) }
            isInvalid={ !!errors.password }
            data-toggle="password"
          />
          <Form.Control.Feedback style={{color:'gray', display:'block'}}>Hasło musi składać się z 8-miu znaków i zawierac wielką literę oraz cyfrę.</Form.Control.Feedback>
          {
            errors.password?.map((suberror,index) => (
              <Form.Control.Feedback key={index} type='invalid'>{ suberror }</Form.Control.Feedback>
            ))
          }
        </InputGroup>
      </Form.Group>
      <Form.Group>
        <Form.Label>Powtórz hasło</Form.Label>
        <InputGroup className="mb-3">
          <Form.Control 
            type='password' name="repassword"
            onChange={ e => setForm({...form, repassword: e.target.value}) }
            isInvalid={ !!errors.repassword }
            data-toggle="repassword"
          />
          <Form.Control.Feedback type='invalid'>{ errors.repassword }</Form.Control.Feedback>
        </InputGroup>
      </Form.Group>
      <Form.Group>
        <Form.Label>Numer telefonu <i style={{color:'gray'}}>(opcjonalnie)</i></Form.Label>
        <InputGroup className="mb-3">
          <Form.Control 
            type='tel' name="phone"
            onChange={ e => setForm({...form, phone: e.target.value}) }
            isInvalid={ !!errors.phone }
          />
          <Form.Control.Feedback type='invalid'>{ errors.phone }</Form.Control.Feedback>
        </InputGroup>
      </Form.Group>
      <Form.Group>
        <Form.Label>Kategoria</Form.Label>
        <Form.Select
            name="category"
            onChange={ e => setForm({...form, category: e.target.value}) }
            isInvalid={ !!errors.category }
            defaultValue="init"
          >
          <option disabled value="init" hidden>Wybierz z listy...</option>
          <option value="Szkoła języków obych">Szkoła języków obych</option>
          <option value="Fitness">Fitness</option>
          <option value="Siłownia">Siłownia</option>
          <option value="Szkoła muzyczna">Szkoła muzyczna</option>
          <option value="Inna">Inna</option>
        </Form.Select>
        <Form.Control.Feedback type='invalid'>{ errors.category }</Form.Control.Feedback>
      </Form.Group>
      <Form.Group>
        <Alert variant={'danger'} show={ !!errors.register } type='invalid'>{ errors.register }</Alert>
      </Form.Group>
      <Form.Group className="text-center pt-4">
        <Button className="rounded-pill col-6" type='submit' onClick={ validation }>Dołącz za darmo</Button>
      </Form.Group>
      <Form.Group className="text-center">
        Posiadasz juz konto? <a href="../../login" id="signup">Zaloguj się</a>
      </Form.Group>
    </>
  )
}

export default InstitutionForm;