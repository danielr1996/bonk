import {shallowEqual, useSelector, useDispatch} from "react-redux";
import {useState, useEffect} from "react";
import {update} from "../store/settings";

export default function UserSettings() {
    const dispatch = useDispatch();
    const [settings, setSettings] = useState(useSelector(state=>state.settings, shallowEqual));
    const [save, setSave] = useState(false)


    const onChange = key => e =>{
        setSettings({...settings, [key]: e.target.value})
    }

    useEffect(()=>{
        (async ()=>{
            if(!save)return;
            dispatch(update(settings))
            localStorage.setItem('settings', JSON.stringify(settings))
            //Simulate delay
            await new Promise(r => setTimeout(r, 500));
            setSave(false);
        })()
    }, [save, settings, dispatch])

    return (
            <>
                <h1>UserSettings</h1>
                BLZ: <input value={settings.blz} onChange={onChange('blz')}/><br/>
                User: <input value={settings.user} onChange={onChange('user')}/><br/>
                PIN: <input type="password" value={settings.pin} onChange={onChange('pin')}/><br/>
                FINTSURL: <input value={settings.fintsUrl} onChange={onChange('fintsUrl')}/><br/>
                {JSON.stringify(settings)}<br/>
                <button onClick={()=>setSave(true)}>{!save ? 'Save' : 'Saving...'}</button>
            </>
    )
}
