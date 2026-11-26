export default function Nevjegy({nev, osztaly, kor, email, bemutatkozas}){

    return(
        <>
        <div className="" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'}}>
                <h2 style={{ width: 80, height: 80, borderRadius: '50%',backgroundColor: 'lightblue',  display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    {nev.split(' ').map(r => r[0]).join('')}
                </h2>
        </div>
        
        <h2>
            {nev}
        </h2>
        <h2>
            {osztaly}
        </h2>
        <h2>
            {kor} éves
        </h2>
        <a href={`mailto:${email}`}>
            {email}
        </a>
        <p>{bemutatkozas}</p>
        </>
    )
}