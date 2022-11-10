import {FunctionComponent} from "react";
import {useAuth} from "react-oidc-context";
import {getConfigValue} from "../lib/config";

export const LogoutButton: FunctionComponent = () => {
    const auth = useAuth();
    return <button
        onClick={() => auth.signoutRedirect({post_logout_redirect_uri: getConfigValue("OAUTH_REDIRECT_URI")})}>
        Logout
    </button>
}
