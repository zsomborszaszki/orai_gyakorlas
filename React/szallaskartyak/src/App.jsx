import Varos from './components/Varos.jsx';
import SzallasKartya from './components/SzallasKartya.jsx';
import './App.css'

function App() {
  
  const SZALLASOK = [
  { id: 1, nev: "Hotel Balaton Panoráma", varos: "Siófok", ar: 32900, kedvezmeny: 15, szabad: 4, csillag: 4, ertekeles: 8.7 },
  { id: 2, nev: "Napfény Apartman", varos: "Siófok", ar: 18900, kedvezmeny: 0, szabad: 0, csillag: 3, ertekeles: 7.9 },
  { id: 3, nev: "Kék Hullám Panzió", varos: "Siófok", ar: 14900, kedvezmeny: 30, szabad: 2, csillag: 2, ertekeles: 8.2 },
  { id: 4, nev: "Mecsek Hotel", varos: "Pécs", ar: 27500, kedvezmeny: 0, szabad: 6, csillag: 4, ertekeles: 9.1 },
  { id: 5, nev: "Zsolnay Vendégház", varos: "Pécs", ar: 16900, kedvezmeny: 10, szabad: 1, csillag: 3, ertekeles: 9.4 },
  { id: 6, nev: "Dobó Szálló", varos: "Eger", ar: 21900, kedvezmeny: 0, szabad: 0, csillag: 3, ertekeles: 8.0 },
  { id: 7, nev: "Bikavér Wellness Hotel", varos: "Eger", ar: 45900, kedvezmeny: 25, szabad: 9, csillag: 5, ertekeles: 9.0 },
  { id: 8, nev: "Rába Part Hotel", varos: "Győr", ar: 24900, kedvezmeny: 0, szabad: 4, csillag: 4, ertekeles: 8.5 },
  { id: 9, nev: "Ifjúsági Szálló", varos: "Győr", ar: 10900, kedvezmeny: 0, szabad: 12, csillag: 1, ertekeles: 6.8 },
];

  const VAROSOK = [...new Set(SZALLASOK.map(a => a.varos))].sort((b,c) => b.localeCompare(c, "hu"));
  console.log(VAROSOK);

  const SZALLASOK_SZAMA = SZALLASOK.length;
  const LASTMINUTE_SZALLASOK = SZALLASOK.filter(a => a.kedvezmeny > 0).length;
  const TELTHAZAK_SZAMA = SZALLASOK.filter(a => a.szabad=== 0).length;
  const ATLAGOS_ERTEKELES = SZALLASOK.reduce((osszeg,a) => osszeg+a.ertekeles,0)/SZALLASOK.length; 


  return (
    <>
    <main>
    <h1>Szálláskártyák</h1>
    <div>
    <p><strong>{SZALLASOK_SZAMA} szállás ¤ {LASTMINUTE_SZALLASOK} last minute ¤ {TELTHAZAK_SZAMA} telt ház</strong></p>
    <p>Átlagos értékelés: {ATLAGOS_ERTEKELES.toFixed(1)}</p>

    </div>
    {VAROSOK.map((varos) => {
      const szallashelyek= SZALLASOK.filter(a=> a.varos === varos);
      return (
        <Varos key={varos} nev={varos} db={szallashelyek.length}>
        {szallashelyek.map((szallas) => <SzallasKartya key={szallas.id} {...szallas} />)}
        </Varos>
      )})}
    </main>
      </>
  )
}

export default App
