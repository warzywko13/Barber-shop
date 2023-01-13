import React from "react";

const Contact = () => {
    return (
        <div className="container mt-5">
            <div className="text-center h1">Kontakt</div>
            <div className="d-flex flex-sm-column flex-md-row justify-content-md-center">
                <div className="p-5">
                    <div>
                        <h3>Godziny otwarcia</h3>
                        <p>
                            Od Pn Do Pt <br />w godzinach: 10-18
                        </p>
                    </div>

                    <div>
                        <h3>Adres</h3>
                        <p>
                            ul. Kwiatkowskiego 13 <br />
                            50-001 Wrocław
                        </p>
                    </div>
                </div>

                <div className="p-5">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2507.155244904615!2d16.956479999999996!3d51.0686842!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x470fc1653a33b127%3A0x4f0ba0768dc4925b!2sKwiatkowskiego%2013%2C%2052-326%20Wroc%C5%82aw!5e0!3m2!1spl!2spl!4v1673391526697!5m2!1spl!2spl"
                        width="400"
                        height="250"
                        loading="lazy"
                        referrerpolicy="no-referrer-when-downgrade"
                    ></iframe>
                </div>
            </div>
        </div>
    );
};

export default Contact;
