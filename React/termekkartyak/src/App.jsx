import './App.css'

function App() {


  const TERMEKEK = [
    {
        id: 1,
        nev: "Logitech G502 HERO egér",
        ar: 15990,
        akcio: 20,
        keszlet: 12,
        ertekeles: 4.8,
        kategoria: "Periféria"
    },
    {
        id: 2,
        nev: "HyperX Alloy Origins billentyűzet",
        ar: 24990,
        akcio: 0,
        keszlet: 3,
        ertekeles: 4.5,
        kategoria: "Periféria"
    },
    {
        id: 3,
        nev: "Samsung 990 EVO SSD 1TB",
        ar: 32990,
        akcio: 15,
        keszlet: 0,
        ertekeles: 4.7,
        kategoria: "Adattárolás"
    },
    {
        id: 4,
        nev: "Kingston NV2 SSD 500GB",
        ar: 14990,
        akcio: 0,
        keszlet: 8,
        ertekeles: 3.9,
        kategoria: "Adattárolás"
    },
    {
        id: 5,
        nev: "ASUS GeForce RTX 4060",
        ar: 119990,
        akcio: 20,
        keszlet: 5,
        ertekeles: 4.9,
        kategoria: "Videokártya"
    },
    {
        id: 6,
        nev: "MSI GeForce RTX 3060",
        ar: 89990,
        akcio: 10,
        keszlet: 0,
        ertekeles: 4.2,
        kategoria: "Videokártya"
    },
    {
        id: 7,
        nev: "AOC 24G2SP monitor",
        ar: 59990,
        akcio: 0,
        keszlet: 2,
        ertekeles: 4.6,
        kategoria: "Monitor"
    },
    {
        id: 8,
        nev: "LG UltraGear 27GN800 monitor",
        ar: 79990,
        akcio: 25,
        keszlet: 15,
        ertekeles: 4.4,
        kategoria: "Monitor"
    }
];

  return (
    <>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
    <span class="fa fa-star checked"></span>
    </>
  )
}

export default App
