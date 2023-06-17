import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image'

function App() {
  return (
    <>
      <div className='p-5 d-flex flex-row' style={{backgroundImage: `url("./img/card-bg.png")`, height: '400px'}}>
        <div className='m-5 d-flex flex-wrap flex-column' style={{flexGrow: "1", minWidth: '500px'}}>
          <div>
            <h3 style={{width: "90%"}}>Zapisz się na zajęcia i zorganizuj je razem z projektem PZ-2</h3>
            <h5 style={{width: "60%"}}>Organizer jakiego potrzebujesz! Wszystkie Twoje zajęcie w jednym miejscu </h5>
          </div>
          <div className="d-flex">
            <Button size="sm" variant="primary">Zacznij korzystać od zaraz</Button>
          </div>
        </div>
        <div className='d-flex flex-wrap' style={{flexGrow: "1"}}>
          <Image src={'https://wac-cdn.atlassian.com/dam/jcr:4ddaea11-b00e-4546-8241-25f45689fed6/hero-illustration.png?cdnVersion=600'} style={{border: 'none', height: '300px'}} thumbnail />
        </div>
      </div>
      <div id='about' className='p-5 d-flex' style={{backgroundImage: `url("./img/card-bg.png")`, height: '400px'}}>
        <div className='m-5 d-flex flex-wrap justify-content-center' style={{width: '100%'}}>
          <h3 style={{width: "100%", textAlign: 'center'}}>Projekt przygotowywany na zaliczenie</h3>
          <h5 style={{width: "60%", textAlign: 'center'}}>Celem projektu jest dostarczenie aplikacji webowej umożliwiającej w łatwy 
          sposób oraganizację jaki poźniejsze zarządzanie różnego rodzaju aktywnościami</h5>
        </div>
      </div>
      <div id='features' className='p-5 d-flex' style={{backgroundImage: `url("./img/card-bg.png")`, height: '400px'}}>
        <div className='m-5 d-flex flex-wrap' style={{width: '100%'}}>
          <h3 style={{width: "100%", textAlign: 'center'}}>Możliwości</h3>
          <div className='m-5 d-flex flex-wrap' style={{flexGrow: "1", minWidth: '500px'}}>
            <div>
              <h4>Dla firm</h4>
                <ul>
                  <li>Łatwa organizacja zajęć</li>
                  <li>Wygodny podgląd w plany zajęć</li>
                  <li>Ułatwiona komunikacja z uczestnikami</li>
                </ul> 
            </div>
          </div>
          <div className='m-5 d-flex flex-wrap' style={{flexGrow: "1"}}>
            <div>
              <h4>Dla użytkowników</h4>
                <ul>
                  <li>Łatwe i przyjemne zapisy na zajęć</li>
                  <li>Wygodny podgląd w plany zajęć</li>
                  <li>Ułatwiona komunikacja z prowadzącym</li>
                </ul> 
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;