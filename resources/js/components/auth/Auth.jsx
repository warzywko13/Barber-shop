import axios from "axios";
import React, { useState } from "react";

import { useNavigate } from "react-router-dom";

const EmailValidate = (email, setErrorEmailMessage) => {
    const regex = email.match(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );

    if (!regex) {
        const message = "Email musi składać się z nazwy + @ + domena";
        setErrorEmailMessage(message);
        return false;
    }

    setErrorEmailMessage("");
    return true;
};

const PasswordValidate = (password, setErrorPasswordMessage) => {
    if (password.length === 0) {
        const message = "Długość hasła nie może być równa 0";
        setErrorPasswordMessage(message);
        return false;
    }

    setErrorPasswordMessage("");
    return true;
};

const Auth = ({ isUserLogged, setIsUserLogged, setUser }) => {
    const navigate = useNavigate();

    if (isUserLogged === true) {
        navigate("/");
    }

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [errorEmailMessage, setErrorEmailMessage] = useState("");
    const [errorPasswordMessage, setErrorPasswordMessage] = useState("");

    const handleEmail = (e) => setEmail(e.target.value);
    const handlePassword = (e) => setPassword(e.target.value);

    const handleButtonClick = async (e) => {
        e.preventDefault();

        /* Validate Email */
        if (!EmailValidate(email, setErrorEmailMessage)) return;

        /* Validate Password */
        if (!PasswordValidate(password, setErrorPasswordMessage)) return;

        await axios({
            method: "POST",
            url: "/api/login",
            params: {
                email: email,
                password: password,
            },
        })
            .then(({ data }) => {
                setUser(data.user);
                setIsUserLogged(true);
                navigate("/");
            })
            .catch(({ response }) => {
                if (response.status == 500) {
                    toast.fire({
                        icon: "error",
                        title: "Błąd podczas logowania",
                        footer: "Błąd połączenia z bazą danych",
                    });
                } else {
                    toast.fire({
                        icon: "error",
                        title: "Błąd podczas logowania",
                        footer: response.data.message,
                    });
                }
            });
    };

    return (
        <form
            className="container mt-5 col-lg-6 col-md-4"
            onSubmit={handleButtonClick}
        >
            <h1 className="text-center">Panel Logowania</h1>
            <div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                        E-mail<span className="text-danger">*</span>
                    </label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        value={email}
                        onChange={handleEmail}
                    />
                    {errorEmailMessage.length > 0 ? (
                        <span className="text-danger fw-bold">
                            {errorEmailMessage}
                        </span>
                    ) : null}
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                        Hasło<span className="text-danger">*</span>
                    </label>
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        value={password}
                        onChange={handlePassword}
                    />
                    {errorPasswordMessage.length > 0 ? (
                        <span className="text-danger fw-bold">
                            {errorPasswordMessage}
                        </span>
                    ) : null}
                </div>
                <button
                    type="submit"
                    className="btn btn-primary d-block m-auto"
                >
                    Zaloguj się
                </button>
            </div>
        </form>
    );
};

export default Auth;
