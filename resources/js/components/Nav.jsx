import React from "react";

import { useNavigate, Link } from "react-router-dom";

const Nav = ({ isUserLogged, setIsUserLogged }) => {
    const navigate = useNavigate();

    const visit = "/visit";
    const contact = "/contact";
    const logIN = "/login";
    const RegIN = "/register";
    const home = "/";
    const logOUT = async () => {
        await axios({
            method: "POST",
            url: "/api/logout",
        })
            .then(({ data }) => {
                navigate(home);
                localStorage.clear();
                setIsUserLogged(false);
            })
            .catch(({ response }) => {
                toast.fire({
                    icon: "error",
                    title: "Błąd podczas wylogowywania",
                    footer: response.data.message,
                });
            });
    };

    return (
        <nav className="navbar navbar-expand-md navbar-light bg-white shadow-sm">
            <div className="container">
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent"
                    aria-expanded="false"
                    aria-label="navbarSupportedContent"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div
                    className="collapse navbar-collapse"
                    id="navbarSupportedContent"
                >
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link
                                className="nav-link text-center fw-bold"
                                to={home}
                            >
                                Strona Główna
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link
                                className="nav-link text-center fw-bold"
                                to={visit}
                            >
                                Wizyty
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link
                                className="nav-link text-center fw-bold"
                                to={contact}
                            >
                                Kontakt
                            </Link>
                        </li>
                    </ul>
                    {isUserLogged ? (
                        <a onClick={logOUT} className="p-1">
                            Wyloguj
                        </a>
                    ) : (
                        <div>
                            <Link to={logIN} className="p-1">
                                Zaloguj
                            </Link>
                            <Link to={RegIN} className="p-1">
                                Zarejestruj
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Nav;
