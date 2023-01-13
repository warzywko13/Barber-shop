import axios from "axios";
import React, { useState } from "react";

import { useNavigate } from "react-router-dom";

const LoginValidate = (login, setErrorLoginMessage) => {
    if (login.includes(" ")) {
        const message = "Login nie może zawierać spacji";
        setErrorLoginMessage(message);
        return false;
    }

    if (login.length <= 3) {
        const message = "Login musi składać się z więcej niż 3 znaków";
        setErrorLoginMessage(message);
        return false;
    }

    setErrorLoginMessage("");
    return true;
};

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

const PasswordValidate = (
    password,
    repeatPassword,
    setErrorPasswordMessage,
    setErrorPasswordRepeatMessage
) => {
    const regexPassword = password.match(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/
    );

    if (!regexPassword) {
        const message =
            "Hasło musi się składać z 8 oraz musi zawierać 1 cyfre, 1 mały znak, 1 duży znak";
        setErrorPasswordMessage(message);
        return false;
    }
    setErrorPasswordMessage("");

    if (password !== repeatPassword) {
        const message = "Hasła nie są takie same!";
        setErrorPasswordRepeatMessage(message);
        return false;
    }
    setErrorPasswordRepeatMessage("");

    return true;
};

const AuthNew = ({ isUserLogged }) => {
    const navigate = useNavigate();

    if (isUserLogged === true) {
        navigate("/");
    }

    const [login, setLogin] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");

    /* ERROR MESSAGE */
    const [errorLoginMessage, setErrorLoginMessage] = useState("");
    const [errorEmailMessage, setErrorEmailMessage] = useState("");
    const [errorPasswordMessage, setErrorPasswordMessage] = useState("");
    const [errorPasswordRepeatMessage, setErrorPasswordRepeatMessage] =
        useState("");

    const handleLogin = (e) => setLogin(e.target.value);
    const handleEmail = (e) => setEmail(e.target.value);
    const handlePassword = (e) => setPassword(e.target.value);
    const handleRepeatPassword = (e) => setRepeatPassword(e.target.value);

    const handleButtonClick = async (e) => {
        e.preventDefault();

        /* Validate Login */
        if (!LoginValidate(login, setErrorLoginMessage)) return;

        /* Validate Email */
        if (!EmailValidate(email, setErrorEmailMessage)) return;

        /* Validate Password */
        if (
            !PasswordValidate(
                password,
                repeatPassword,
                setErrorPasswordMessage,
                setErrorPasswordRepeatMessage
            )
        )
            return;

        await axios({
            method: "POST",
            url: "/api/register",
            params: {
                name: login,
                email: email,
                password: password,
                repeatPassword: repeatPassword,
            },
        })
            .then(({ data }) => {
                toast.fire({
                    icon: "success",
                    title: data.message,
                });
                navigate("/login");
            })
            .catch(({ response }) => {
                toast.fire({
                    icon: "error",
                    title: "Błąd tworzenia użytkownika",
                    footer: response.data.message,
                });
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
                    <label htmlFor="login" className="form-label">
                        Login<span className="text-danger">*</span>
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="login"
                        value={login}
                        onChange={handleLogin}
                    />
                    {errorLoginMessage.length > 0 ? (
                        <span className="text-danger fw-bold">
                            {errorLoginMessage}
                        </span>
                    ) : null}
                </div>
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
                <div className="mb-3">
                    <label htmlFor="repeatPassword" className="form-label">
                        Powtórz hasło<span className="text-danger">*</span>
                    </label>
                    <input
                        type="password"
                        className="form-control"
                        id="repeatPassword"
                        value={repeatPassword}
                        onChange={handleRepeatPassword}
                    />
                    {errorPasswordRepeatMessage.length > 0 ? (
                        <span className="text-danger fw-bold">
                            {errorPasswordRepeatMessage}
                        </span>
                    ) : null}
                </div>
                <button
                    type="submit"
                    className="btn btn-primary d-block m-auto"
                >
                    Zarejestruj się
                </button>
            </div>
        </form>
    );
};

export default AuthNew;
