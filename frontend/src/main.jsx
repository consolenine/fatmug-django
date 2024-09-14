import React from "react";
import ReactDOM from "react-dom/client";
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import "./assets/styles/index.css";

import { ChakraProvider } from '@chakra-ui/react';

import { 
    Root, Video, ErrorPage, VideoLibrary
} from "./routes";

import {
    Home
} from "./components";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: "",
                element: <Home />,
            },
            {
                path: "video/:video_uuid",
                element: <Video />,
            },
            {
                path: "library",
                element: <VideoLibrary />,
            }
        ]
    },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
    <ChakraProvider>
        <RouterProvider router={router} />
    </ChakraProvider>
);