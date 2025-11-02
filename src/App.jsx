import { useState } from "react";
import "./App.css";
import Pagination from "@mui/material/Pagination";

// Local avatar images
import ada from "./assets/avatars/ada.png";
import alan from "./assets/avatars/alan.jpg";
import grace from "./assets/avatars/grace.jpg";
import john from "./assets/avatars/john.png";
import jane from "./assets/avatars/jane.jpg";
import franz from "./assets/avatars/franz.jpg";
import clarice from "./assets/avatars/clarice.jpg";
import albert from "./assets/avatars/albert.jpg";
import sabahattin from "./assets/avatars/sabahattin.jpg";
import ye from "./assets/avatars/profile.jpg";

// --- Hard-coded contacts (you can add avatars later if desired) ---
const FALLBACK_CONTACTS = [
    {
        id: 1,
        name: "Ada Lovelace",
        phone: "(555) 010-0101",
        email: "ada@example.com",
        photo: ada,
    },
    {
        id: 2,
        name: "Alan Turing",
        phone: "(555) 010-0102",
        email: "alan@example.com",
        photo: alan,
    },
    {
        id: 3,
        name: "Grace Hopper",
        phone: "(555) 010-0103",
        email: "grace@example.com",
        photo: grace,
    },
    {
        id: 4,
        name: "John Doe",
        phone: "(555) 010-0104",
        email: "john.doe@example.com",
        photo: john,
    },
    {
        id: 5,
        name: "Jane Doe",
        phone: "(555) 010-0105",
        email: "jane.doe@example.com",
        photo: jane,
    },
    {
        id: 6,
        name: "Franz Kafka",
        phone: "(555) 010-0106",
        email: "franz.kafka@example.com",
        photo: franz,
    },
    {
        id: 7,
        name: "Clarice Lispector",
        phone: "(555) 010-0107",
        email: "clarice.lispector@example.com",
        photo: clarice,
    },
    {
        id: 8,
        name: "Albert Camus",
        phone: "(555) 010-0108",
        email: "albert.camus@example.com",
        photo: albert,
    },
    {
        id: 9,
        name: "Sabahattin Ali",
        phone: "(555) 010-0109",
        email: "sabahattin.ali@example.com",
        photo: sabahattin,
    },
    {
        id: 10,
        name: "Ye Moe",
        phone: "(555) 010-0110",
        email: "ye.moe@example.com",
        photo: ye,
    },
];

export default function App() {
    const [contacts, setContacts] = useState(FALLBACK_CONTACTS);
    const [query, setQuery] = useState("");
    const [form, setForm] = useState({ name: "", phone: "", email: "" });

    // --- Filtered contacts based on search ---
    const filteredContacts = contacts.filter((c) =>
        [c.name, c.phone].some((v) => v.toLowerCase().includes(query.toLowerCase()))
    );

    // --- Pagination state & logic ---
    const [page, setPage] = useState(1);
    const contactsPerPage = 1;
    const totalPages = Math.ceil(filteredContacts.length / contactsPerPage);
    const startIndex = (page - 1) * contactsPerPage;
    const currentContacts = filteredContacts.slice(
        startIndex,
        startIndex + contactsPerPage
    );

    const handlePageChange = (event, value) => setPage(value);

    // --- Add Contact form logic ---
    function handleSubmit(e) {
        e.preventDefault();
        if (!form.name || !form.phone) return;
        const newContact = { id: Date.now(), ...form };
        setContacts([...contacts, newContact]);
        setForm({ name: "", phone: "", email: "" });
    }

    return (
        <main className="page">
            {/* Header */}
            <header className="page__header">
                <h1 className="page__title">Phonebook Challenge</h1>
                <p className="page__subtitle">Build a simple contact directory</p>
            </header>

            {/* Search */}
            <section className="search" aria-labelledby="search-heading">
                <h2 id="search-heading">Search Contacts</h2>
                <div className="search__controls">
                    <label htmlFor="search-input">Search</label>
                    <input
                        id="search-input"
                        type="search"
                        placeholder="Search by name or phone"
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setPage(1); // reset to first page after new search
                        }}
                    />
                </div>
                <p className="search__results">
                    Showing {filteredContacts.length}{" "}
                    {filteredContacts.length === 1 ? "result" : "results"}
                </p>
            </section>

            {/* Contacts */}
            <section className="contacts" aria-labelledby="contacts-heading">
                <h2 id="contacts-heading">Contacts</h2>
                <ul className="contacts__grid" role="list">
                    {currentContacts.map((c) => (
                        <li key={c.id}>
                            <article className="contact-card">
                                <img
                                    className="avatar"
                                    src={c.photo}
                                    alt={`Portrait of ${c.name}`}
                                    width="96"
                                    height="96"
                                    loading="lazy"
                                />
                                <div>
                                    <h3 className="contact-card__name">{c.name}</h3>
                                    <p className="contact-card__phone">
                                        <strong>Phone:</strong>{" "}
                                        <a href={`tel:${c.phone}`}>{c.phone}</a>
                                    </p>
                                    <p className="contact-card__email">
                                        <strong>Email:</strong>{" "}
                                        <a href={`mailto:${c.email}`}>{c.email}</a>
                                    </p>
                                </div>
                            </article>
                        </li>
                    ))}
                </ul>

                {/* Pagination control */}
                {totalPages > 1 && (
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            marginTop: "1.5rem",
                        }}
                    >
                        <Pagination
                            count={totalPages}
                            page={page}
                            onChange={handlePageChange}
                            color="primary"
                        />
                    </div>
                )}
            </section>

            {/* Form */}
            <section className="form" aria-labelledby="form-heading">
                <h2 id="form-heading">Add a Contact</h2>
                <form className="form__body" onSubmit={handleSubmit} noValidate>
                    <div className="field">
                        <label htmlFor="name">Name</label>
                        <input
                            id="name"
                            name="name"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            required
                            minLength={2}
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="phone">Phone</label>
                        <input
                            id="phone"
                            name="phone"
                            inputMode="tel"
                            placeholder="(555) 555-5555"
                            value={form.phone}
                            onChange={(e) =>
                                setForm({ ...form, phone: e.target.value })
                            }
                            required
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={(e) =>
                                setForm({ ...form, email: e.target.value })
                            }
                        />
                    </div>
                    <div className="form__actions">
                        <button className="btn" type="submit">
                            Add Contact
                        </button>
                    </div>
                </form>
            </section>

            <footer className="page__footer">
                <small>
                    Starter provided. Complete tasks per README and make this page
                    shine.
                </small>
            </footer>
        </main>
    );
}
