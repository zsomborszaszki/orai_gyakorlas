import akciosAr from "./AkciosAr"

export default function TermekKartya({termek, nev, ar, akcio, keszlet, ertekeles})
{
    if(akcio>0)
    {
        return(
            <>
        <div className="" style={{opacity: keszlet === 0 ? 0.5 : 1}}>
            <h3>{nev}</h3>
            <h5><s>Eredeti ár: {ar} Ft</s></h5>
            <h5 style={{color:"red"}}>Akciós ár: {akciosAr(termek)} Ft</h5>
            <h5>Akció: {akcio}%</h5>
            {keszlet==0
            ? <h5>Elfogyott</h5>
            :  keszlet<5 ? <h5 style={{color:"orange"}}>Utolsó {keszlet}db</h5> : <h5 style={{color:"green"}}>Raktáron</h5>
            }
            <p>
            {'★'.repeat(Math.round(ertekeles))}
            {'☆'.repeat(5 - Math.round(ertekeles))}
            </p>
            <button disabled={keszlet===0} >Kosárba</button>
        </div>
        </>
        )
    }
----------------
    if(akcio===0)
    {
        return(
            <>
        <h3>{nev}</h3>
        <h5><b>Ár: {ar} </b></h5>
        <h5>Készlet: {keszlet}db</h5>
        <p>
        {'★'.repeat(Math.round(ertekeles))}
        {'☆'.repeat(5 - Math.round(ertekeles))}
        </p>
        </>
        )
    }
    
}