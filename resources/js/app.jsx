import "./bootstrap";

import React, { StrictMode } from "react";
import ReactDOM from "react-dom";

import App from "./components/App";
import { BrowserRouter } from "react-router-dom";

//sweatalert2
import Swal from "sweetalert2";

window.Swal = Swal;

const toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
});

window.toast = toast;

if (document.getElementById("app")) {
    ReactDOM.render(
        <StrictMode>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </StrictMode>,
        document.getElementById("app")
    );
}
