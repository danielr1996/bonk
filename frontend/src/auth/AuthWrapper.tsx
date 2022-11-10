import {FunctionComponent, PropsWithChildren} from "react";
import {AuthProvider} from "react-oidc-context";
import {User} from "oidc-client-ts";
import {getConfigValue} from "../lib/config";

export const AuthWrapper: FunctionComponent<PropsWithChildren> = ({children})=>{
    const oidcConfig = {
        authority: getConfigValue("OAUTH_URL"),
        client_id: getConfigValue("OAUTH_CLIENT_ID"),
        redirect_uri: window.location.toString(),
        onSigninCallback: () => {
            window.history.replaceState(
                {},
                document.title,
                window.location.pathname
            )
        },
        onRemoveUser: () => {
            console.log('user removed')
            window.location.pathname = "/loggedout"
        },
        automaticSilentRenew: true,
    }

    return <AuthProvider {...oidcConfig}>
        {children}
    </AuthProvider>
}

export const getToken = ()=>{
    const authority = getConfigValue("OAUTH_URL")
    const clientId = getConfigValue("OAUTH_CLIENT_ID")
    const oidcStorage = sessionStorage.getItem(`oidc.user:${authority}:${clientId}`)
    if (!oidcStorage) {
        return null;
    }
    return User.fromStorageString(oidcStorage).access_token
}
