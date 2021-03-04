import {shallowEqual, useSelector} from "react-redux";
import {useEffect, useState} from "react";

export default function TanMode() {
    const settings = useSelector(state=>state.settings, shallowEqual);
    const [tanModes, setTanModes] = useState([])

    useEffect(()=>{
        (async ()=>{
            const res = await((await fetch('http://localhost:8080/api/tanmode.php', {
                method: 'POST',
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({options: {url: settings.fintsUrl, blz: settings.blz, user: settings.user, pin: settings.pin}}, null, 4)
            })).json())
            setTanModes(res);
        })()
    },[settings])
    return (
        <>
            <h1>TanMode</h1>
            {JSON.stringify(settings)}
            <select>
                {tanModes.map(tanMode=>(<option key={tanMode.sicherheitsfunktion.toString()}>
                    {tanMode.nameDesZweiSchrittVerfahrens} ({tanMode.sicherheitsfunktion})
                </option>))}
            </select>
        </>
    )
}
