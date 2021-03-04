import {useEffect, useState} from "preact/hooks";
import {createContext} from "preact";

export const useStateWithLocalStorage = (localStorageKey, defaultValue) => {
    const [value, setValue] = useState(
        localStorage.getItem(localStorageKey) ?? defaultValue ?? ''
    );

    useEffect(() => {
        localStorage.setItem(localStorageKey, value);
    }, [value]);

    return [value, setValue];
};

export const onChange = fn => e => fn(e.target.value);

