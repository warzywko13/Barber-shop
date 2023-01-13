import axios from "axios";
import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import "../../../css/visit.css";

const Visit = ({ isUserLogged, user }) => {
    const { name } = user;
    const [visits, setVisits] = useState([]);

    const getVisits = async () => {
        await axios
            .get("/api/get_all_visits")
            .then(({ data }) => {
                setVisits(data.visits);
            })
            .catch(({ response }) => {
                toast.fire({
                    icon: "error",
                    title: "Błąd pobierania listy produktów",
                    footer: response.data.message,
                });
            });
    };

    useEffect(() => {
        getVisits();
    }, []);

    const deleteVisit = async (id) => {
        Swal.fire({
            title: "Czy na pewno chcesz usunąć tą wizytę?",
            showDenyButton: true,
            confirmButtonText: "Tak, usuń",
            denyButtonText: "Anuluj",
        }).then((result) => {
            if (result.isConfirmed) {
                axios
                    .get(`/api/delete_visit/${id}`)
                    .then(() => {
                        toast.fire({
                            icon: "success",
                            title: "Wizyta została usunięta",
                        });
                        getVisits();
                    })
                    .catch(({ response }) => {
                        console.log(response);
                        toast.fire({
                            icon: "error",
                            title: "Błąd podczas usuwania wizyty",
                            footer: response.data.message,
                        });
                    });
            }
        });
    };

    return (
        <div className="container mt-3">
            <h2 className="text-center">Lista Wizyt</h2>

            {isUserLogged && (
                <div className="d-flex justify-content-end">
                    <Link className="btn btn-secondary" to={`/visit/new`}>
                        Dodaj Wizytę
                    </Link>
                </div>
            )}

            <div className="row justify-content-center mt-3">
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Usługa</th>
                            <th scope="col">Data wizyty</th>
                            <th scope="col">Godzina wizyty wizyty</th>
                            <th scope="col">Czas wizyty</th>
                            <th scope="col">Użytkownik</th>
                            {isUserLogged && (
                                <>
                                    <th scope="col">Edytuj</th>
                                    <th scope="col">Usuń</th>
                                </>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {visits.length > 0 &&
                            visits.map((item, key) => {
                                const {
                                    service,
                                    date,
                                    time,
                                    serviceTime,
                                    user,
                                    id,
                                } = item;

                                return (
                                    <tr key={key}>
                                        <td>{key + 1}</td>
                                        <td>{service}</td>
                                        <td>{date}</td>
                                        <td>{time.substring(0, 5)}</td>
                                        <td>{serviceTime}</td>
                                        <td>{user}</td>
                                        {isUserLogged && user === name && (
                                            <>
                                                <td>
                                                    <Link
                                                        className="btn-icon success p-2"
                                                        to={`/visit/edit/${id}`}
                                                    >
                                                        <i className="fa fa-pencil-alt"></i>
                                                    </Link>
                                                </td>
                                                <td>
                                                    <Link
                                                        className="btn-icon danger p-2"
                                                        onClick={() =>
                                                            deleteVisit(id)
                                                        }
                                                    >
                                                        <i className="fa fa-trash-alt"></i>
                                                    </Link>
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                );
                            })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Visit;
