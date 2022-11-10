import React from 'react';
import ReactDOM from 'react-dom/client';
import {App} from './App';
import {AuthWrapper} from "./auth/AuthWrapper";
import {AuthGuard} from "./auth/AuthGuard";
import {Provider} from "react-redux";
import {store} from "./redux/store";

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <AuthWrapper>
        <AuthGuard>
            <Provider store={store}>
                <App/>
            </Provider>
        </AuthGuard>
    </AuthWrapper>
);
