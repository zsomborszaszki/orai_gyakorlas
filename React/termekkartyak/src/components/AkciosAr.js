export default function akciosAr(termek)
{
    return Math.round(
        termek.ar * (1 - termek.akcio/100)
    )
}