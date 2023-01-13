import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import Index from "../components/Index";
import Nav from "../components/Nav";

/* Visit */
import Visit from "../components/visit/Visit";
import AddEditVisit from "../components/visit/AddEditVisit";

/* Contact */
import Contact from "../components/Contact";

/* Auth */
import Auth from "../components/auth/Auth";
import AuthNew from "../components/auth/AuthNew";

import NotFound from "../components/NotFound";

const Router = () => {
    const getUser = async () => {
        await axios({
            method: "GET",
            url: "/api/user",
        })
            .then(({ data }) => {
                setUser(data);
                setIsUserLogged(true);
            })
            .catch(({ response }) => {
                setIsUserLogged(false);
            });
    };

    useEffect(async () => {
        getUser();
    }, []);

    const [isUserLogged, setIsUserLogged] = useState(false);
    const [user, setUser] = useState([]);

    return (
        <>
            <Nav
                isUserLogged={isUserLogged}
                setIsUserLogged={setIsUserLogged}
            />
            <Routes>
                <Route path="/" element={<Index />} />

                {/* Start  Visit */}
                <Route
                    path="/visit"
                    element={<Visit isUserLogged={isUserLogged} user={user} />}
                />
                <Route
                    path="/visit/new"
                    element={
                        <AddEditVisit isUserLogged={isUserLogged} user={user} />
                    }
                />
                <Route
                    path="/visit/edit/:id"
                    element={
                        <AddEditVisit isUserLogged={isUserLogged} user={user} />
                    }
                />

                {/* Contact */}
                <Route path="/contact" element={<Contact />} />

                {/* Start Auth */}
                <Route
                    path="/login"
                    element={
                        <Auth
                            isUserLogged={isUserLogged}
                            setIsUserLogged={setIsUserLogged}
                            setUser={setUser}
                        />
                    }
                />
                <Route
                    path="/register"
                    element={<AuthNew isUserLogged={isUserLogged} />}
                />

                <Route path="/*" element={<NotFound />} />
            </Routes>
        </>
    );
};

export default Router;
