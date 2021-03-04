import {ContextComp} from "../utils";
import {useContext} from "preact/hooks";
import {UserSettingsContext} from "./userSettings";

export default function TanMedia() {
    const context = useContext(UserSettingsContext);

    return (
        <select>
            <option>{context}</option>
            <option>999</option>
            <option>921</option>
            <option>901</option>
        </select>
    )
}
