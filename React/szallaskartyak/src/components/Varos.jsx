import '../components/Varos.css'

export default function Varos({nev,db,children})
{

    return(
        <section>
            <h2>{nev} ({db})</h2>
            <div className="racs" style={{}} >{children}</div>
        </section>
    )
}