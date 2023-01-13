import React, { useState, useEffect } from "react";
import axios from "axios";

import { useNavigate, useParams } from "react-router-dom";

/* Service Time Options */
const options = [
    {
        label: "15",
        value: "15",
    },
    {
        label: "30",
        value: "30",
    },
    {
        label: "45",
        value: "45",
    },
    {
        label: "60",
        value: "60",
    },
];

const salonWorkTime = {
    start: "10:00",
    end: "18:00",
};

/* Error Message style */
const errorMessageStyle = "text-danger fw-bold";

/* Get Todays Date */
const GetDodayDate = () => {
    try {
        const today = new Date();
        const dd = String(today.getDate()).padStart(2, "0");
        const mm = String(today.getMonth() + 1).padStart(2, "0");
        const yyyy = today.getFullYear();

        return yyyy + "-" + mm + "-" + dd;
    } catch (e) {
        return "";
    }
};

/* Validate form before send */
const ValidateAllForm = (
    service,
    setServiceErrorMessage,
    date,
    setDateErrorMessage,
    time,
    setTimeErrorMessage,
    serviceTime,
    setServiceTimeErrorMessage
) => {
    const textLength = 5;
    const subDate = new Date(date) - new Date(GetDodayDate());

    /* Validation service */
    if (service.length <= textLength) {
        const message = `Nazwa usługi musi składać się z więcej niż ${textLength} znaków`;
        setServiceErrorMessage(message);
        return false;
    }
    setServiceErrorMessage("");

    /* Validation date */
    if (date === "") {
        const message = "Data nie może być pusta.";
        setDateErrorMessage(message);
        return false;
    }

    /* Validate date with the current day and time in future */
    if (subDate < 0) {
        const message = "Data nie może być z przeszłości.";
        setDateErrorMessage(message);
        return false;
    }
    setDateErrorMessage("");

    /* Validation time */
    if (time === "") {
        const message = "Godzina nie może być pusta";
        setTimeErrorMessage(message);

        return false;
    }

    /* Validate date with the current day and time in future */
    const formDate = new Date(`${date} ${time}`).getTime(),
        currentDate = new Date().getTime();

    if (subDate === 0 && formDate <= currentDate) {
        const message =
            "Przy dzisiejszej dacie godzina musi być z przyszłości.";
        setTimeErrorMessage(message);

        return false;
    }

    /* Validate salon work time */
    if (time < salonWorkTime.start || time > salonWorkTime.end) {
        const message = `Salon pracuje w godzinach ${salonWorkTime.start} - ${salonWorkTime.end}`;
        setTimeErrorMessage(message);

        return false;
    }
    setTimeErrorMessage("");

    /* Validation Service time */
    if (serviceTime === "") {
        const message = "Czas usługi nie może być pusty";
        setServiceTimeErrorMessage(message);

        return false;
    }

    if (serviceTime < 15 || serviceTime > 60) {
        const message =
            "Czas usługi nie może być krótszy niż 15 minut i dłuższy niż 60";
        setServiceTimeErrorMessage(message);

        return false;
    }
    setServiceTimeErrorMessage("");

    return true;
};

const NewVisit = ({ isUserLogged, user }) => {
    const navigate = useNavigate();

    if (isUserLogged === false) {
        navigate("/");
    }

    const { id } = useParams();
    const editVisitStatus = id ? true : false;

    useEffect(() => {
        if (editVisitStatus) {
            const getEditData = async () => {
                await axios({
                    method: "POST",
                    url: `/api/get_visit/${id}`,
                })
                    .then(({ data }) => {
                        const { service, date, time, serviceTime } = data.visit;
                        setSevice(service);
                        setDate(date);
                        setTime(time);
                        setServiceTime(serviceTime);
                    })
                    .catch(({ response }) => {
                        toast.fire({
                            icon: "error",
                            title: "Błąd pobierania Wizyty",
                            footer: response.data.message,
                        });
                    });
            };

            getEditData();
        }
    }, []);

    const { name } = user;
    const [service, setSevice] = useState("");
    const [date, setDate] = useState(GetDodayDate());
    const [time, setTime] = useState("");
    const [serviceTime, setServiceTime] = useState("15");

    const handleService = (e) => setSevice(e.target.value);
    const handleDate = (e) => setDate(e.target.value);
    const handleTime = (e) => {
        const time = e.target.value;
        time < 0 ? setTime(0) : setTime(time);
    };
    const handleServiceTime = (e) => setServiceTime(e.target.value);

    /* Error Messages */
    const [serviceErrorMessage, setServiceErrorMessage] = useState("");
    const [dateErrorMessage, setDateErrorMessage] = useState("");
    const [timeErrorMessage, setTimeErrorMessage] = useState("");
    const [serviceTimeErrorMessage, setServiceTimeErrorMessage] = useState("");

    const AddEditVisit = async (e) => {
        e.preventDefault();

        const validateResult = ValidateAllForm(
            service,
            setServiceErrorMessage,
            date,
            setDateErrorMessage,
            time,
            setTimeErrorMessage,
            serviceTime,
            setServiceTimeErrorMessage
        );
        if (!validateResult) return;

        if (editVisitStatus) {
            await axios({
                method: "POST",
                url: `/api/edit_visit/${id}`,
                params: {
                    id: id,
                    service,
                    date,
                    time,
                    serviceTime,
                },
            })
                .then(({ data }) => {
                    toast.fire({
                        icon: "success",
                        title: data.message,
                    });
                    navigate("/visit");
                })
                .catch(({ response }) => {
                    Swal.fire({
                        icon: "error",
                        title: "Błąd Podczas aktualizacji Wizyty",
                        text: response.data.message,
                    });
                });
        } else {
            await axios({
                method: "POST",
                url: "/api/add_visit",
                params: {
                    service: service,
                    date: date,
                    time: time,
                    serviceTime: serviceTime,
                    user: name,
                },
            })
                .then(({ data }) => {
                    toast.fire({
                        icon: "success",
                        title: data.message,
                    });
                    navigate("/visit");
                })
                .catch(({ response }) => {
                    Swal.fire({
                        icon: "error",
                        title: "Błąd Podczas dodawania Wizyty",
                        text: response.data.message,
                    });
                });
        }
    };

    return (
        <div className="container">
            <h2 className="text-center mt-4">
                {editVisitStatus ? "Edycja wizyty" : "Nowa wizyta"}
            </h2>

            <form className="form mt-4" onSubmit={AddEditVisit}>
                <div className="mb-3">
                    <label htmlFor="service" className="form-label">
                        Usługa <span className="text-danger">*</span>
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="serivce"
                        value={service}
                        onChange={handleService}
                    />
                    {serviceErrorMessage.length > 0 && (
                        <span className={errorMessageStyle}>
                            {serviceErrorMessage}
                        </span>
                    )}
                </div>
                <div className="mb-3">
                    <label htmlFor="date" className="form-label">
                        Data <span className="text-danger">*</span>
                    </label>
                    <input
                        type="date"
                        className="form-control"
                        id="date"
                        value={date}
                        onChange={handleDate}
                    />
                    {dateErrorMessage.length > 0 && (
                        <span className={errorMessageStyle}>
                            {dateErrorMessage}
                        </span>
                    )}
                </div>
                <div className="mb-3">
                    <label htmlFor="time" className="form-label">
                        Godzina <span className="text-danger">*</span>
                    </label>
                    <input
                        type="time"
                        className="form-control"
                        id="time"
                        value={time}
                        onChange={handleTime}
                    />
                    {timeErrorMessage.length > 0 && (
                        <span className={errorMessageStyle}>
                            {timeErrorMessage}
                        </span>
                    )}
                </div>
                <div className="mb-3">
                    <label htmlFor="serviceTime" className="form-label">
                        Czas usługi <span className="text-danger">*</span>
                    </label>
                    <select
                        id="serviceTime"
                        className="form-control form-select"
                        value={serviceTime}
                        onChange={handleServiceTime}
                    >
                        {options.map((option, key) => (
                            <option key={key} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    {serviceTimeErrorMessage.length > 0 && (
                        <span className={errorMessageStyle}>
                            {serviceTimeErrorMessage}
                        </span>
                    )}
                </div>
                <div className="text-center">
                    {editVisitStatus ? (
                        <button
                            type="submit"
                            className="btn btn-secondary"
                            onClick={AddEditVisit}
                        >
                            Edytuj wizytę
                        </button>
                    ) : (
                        <button type="submit" className="btn btn-secondary">
                            Umów wizytę
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default NewVisit;
