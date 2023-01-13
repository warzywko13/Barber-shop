import React from "react";

import { useNavigate } from "react-router-dom";

import "../../css/index.css";

const Index = () => {
    const navigate = useNavigate();

    const visit = () => navigate("/visit");
    const home = () => navigate("/");

    return (
        <>
            <header className="position-relative overflow-hidden text-center bg-light">
                <div className="col-md-5 p-lg-5 mx-auto my-5">
                    <h1 className="display-4 fw-normal">Barber Wrocław</h1>
                    <p className="lead fw-normal">
                        KOLORYZACJE / PIELĘGNACJA WŁOSÓW / STRZYŻENIE
                    </p>
                    <a className="btn btn-outline-light" onClick={visit}>
                        Umów wizytę
                    </a>
                </div>
            </header>

            <main className="container">
                <h2 className="text-center mt-4 fs-1">Nasza Historia</h2>
                <p className="mt-4 fs-4">
                    Przez szereg lat zdobyliśmy szereg certyfikatów z zawodu i
                    uznanie dziesiątek zadowolonych kobiet i mężczyzn. Od 2012
                    roku działamy na rynku Wrocławskim, do tej pory
                    zlokalizowani byliśmy w CH Astra, a następnie na Bulwarze
                    Ikara. Od 2021 roku znajdujemy się na ulicy Bolesławieckiej
                    (od strony Legnickiej) we Wrocławiu. Jesteśmy pewni, że
                    jeżeli zdecydujesz się powierzyć nam swoje włosy, także
                    dołączysz do grona naszych stałych klientek i klientów!
                </p>
                <p className="text-end">~Zapraszamy!</p>
            </main>
        </>
    );
};

export default Index;
