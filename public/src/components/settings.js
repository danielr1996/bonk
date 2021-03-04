import {useStateWithLocalStorage} from "../utils";
import TanMode from "./tanMode";
import UserSettings from "./userSettings";


// export const [blz, setBlz] = useStateWithLocalStorage('blz');
// export const [user, setUser] = useStateWithLocalStorage('user');
// export const [fintsUrl, setFintsUrl] = useStateWithLocalStorage('fintsUrl', 'https://banking-by1.s-fints-pt-by.de/fints30');
// export const [pin, setPin] = useStateWithLocalStorage('pin');
export default function Settings() {
    return (
        <>
                <UserSettings/>
                <TanMode/>
        </>
    )
}
