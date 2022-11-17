import React, {FunctionComponent, useState} from 'react';
import '@tremor/react/dist/esm/tremor.css';
import {createBrowserRouter, Outlet, RouterProvider} from "react-router-dom";
import {ErrorPage} from "./pages/ErrorPage";
import {Layout} from "./Layout";
import {Dashboard} from "./pages/Dashboard";
import {Statements} from "./pages/statements/Statements";
import {Statement} from "./pages/statements/Statement";
import {Categories} from "./pages/categories/Categories";
import {Settings} from "./pages/Settings";
const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout><Outlet></Outlet></Layout>,
        errorElement: <Layout><ErrorPage /></Layout>,
        children: [
            {
                path: "",
                element: <Dashboard />,
            },
            {
                path: "statements",
                children: [
                    {
                        path: "",
                        element: <Statements />,
                    },{
                        path: ":id",
                        element: <Statement />,
                    },
                ]
            },
            {
                path: "categories",
                children: [
                    {
                        path: "",
                        element: <Categories />,
                    }
                ]
            },
            {
                path: "settings",
                children: [
                    {
                        path: "",
                        element: <Settings />,
                    }
                ]
            },
        ]
    },

]);
export const App: FunctionComponent = () => {
    return <RouterProvider router={router} />
}
