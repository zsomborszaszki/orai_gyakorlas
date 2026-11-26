export default function Keszsegek({lista}){

    return(
        <>
        <h3>Készségeim(5)</h3>

        <ul style={{display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center'}}>
            {lista.map((keszsegek,index) => {
                return <li style={{listStyle: 'none', backgroundColor:"lightblue"}} key={index}>{keszsegek}</li>
            })}
        </ul>
        </>
    )
}