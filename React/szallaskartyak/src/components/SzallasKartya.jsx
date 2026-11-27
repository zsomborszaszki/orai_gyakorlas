import '../components/SzallasKartya.css'

export default function SzallasKartya({nev,ar,kedvezmeny,szabad,csillag,ertekeles})
{
    return(

        <div className='kartya'>
            <span className='lastMinute'>{kedvezmeny>0 ? `Last Minute - ${kedvezmeny}%`: '\u00a0'}</span>
            <h3>{nev} <span>{csillag}</span></h3>
            <p>{ertekeles}</p>
            <p>{ar}</p>
            <p>{szabad}</p>
            <button>Foglalás</button>
        </div>
    )
}