import './App.css'
import Header from './components/Header'
import Keszsegek from './components/Keszsegek'
import Nevjegy from './components/Nevjegy'
import Footer from './components/Footer'

function App() {
  
  const adatok = {
    nev:"Szaszki Zsombor",
    osztaly:"13.C",
    kor:19,
    email:"pelda@pelda.com",
    bemutatkozas: "Lorem ipsum dolor sit amet.",
    keszsegek:["elso","masodik","harmadik", "negyedik", "otodik"]
  }

  return (
    <>
      <Header />
      <Nevjegy nev={adatok.nev} osztaly={adatok.osztaly} kor={adatok.kor} email={adatok.email} bemutatkozas={adatok.bemutatkozas} />
      <Keszsegek  lista={adatok.keszsegek} />
      <Footer nev={adatok.nev}/>
    </>
  )
}

export default App
