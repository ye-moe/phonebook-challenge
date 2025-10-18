import { useEffect, useMemo, useState } from "react";
import "./App.css";

const FALLBACK_CONTACTS = [
    {
        id: 1,
        name: "Ada Lovelace",
        phone: "(555) 010-0101",
        email: "ada@example.com",
    },
    {
        id: 2,
        name: "Alan Turing",
        phone: "(555) 010-0102",
        email: "alan@example.com",
    },
    {
        id: 3,
        name: "Grace Hopper",
        phone: "(555) 010-0103",
        email: "grace@example.com",
    },
    {
        id: 4,
        name: "John Doe",
        phone: "(555) 010-0104",
        email: "john.doe@example.com",
    },
    {
        id: 5,
        name: "Jane Doe",
        phone: "(555) 010-0105",
        email: "jane.doe@example.com",
    },
    {
        id: 6,
        name: "Franz Kafka",
        phone: "(555) 010-0106",
        email: "franz.kafka@example.com",
    },
    {
        id: 7,
        name: "Clarice Lispector",
        phone: "(555) 010-0107",
        email: "clarice.lispector@example.com",
    },
    {
        id: 8,
        name: "Albert Camus",
        phone: "(555) 010-0108",
        email: "albert.camus@example.com",
    },
    {
        id: 9,
        name: "Sabahattin Ali",
        phone: "(555) 010-0109",
        email: "sabahattin.ali@example.com",
    },
    {
        id: 10,
        name: "Ye Moe",
        phone: "(555) 010-0110",
        email: "ye.moe@example.com",
    },
];

const App = () => {
    const [contacts, setContacts] = useState(FALLBACK_CONTACTS);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {}, []);

    const [query, setQuery] = useState("");

    const [form, setForm] = useState({ name: "", phone: "", email: "" });
    function handleSubmit(e) {
        e.preventDefault();
        // Add contact submission logic here
    }

    return (
        <main className="page" data-testid="page-root">
            <header className="page__header">
                <h1 className="page__title">Phonebook Challenge</h1>
                <p className="page__subtitle">Build a simple contact directory</p>
            </header>

            <section className="search" aria-labelledby="search-heading">
                <h2 id="search-heading">Search Contacts</h2>
                <div className="search__controls">
                    <label htmlFor="search-input">Search</label>
                    <input
                        id="search-input"
                        type="search"
                        placeholder="Search by name or phone"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        data-testid="search-input"
                    />
                </div>

                <p className="search__results" data-testid="results-count">
                    Showing {contacts.length}{" "}
                    {contacts.length === 1 ? "result" : "results"}
                    {loading ? " (loading...)" : ""}
                    {error ? ` (error: ${error})` : ""}
                </p>
            </section>

            <section className="contacts" aria-labelledby="contacts-heading">
                <h2 id="contacts-heading">Contacts</h2>

                <ul className="contacts__grid" role="list">
                    {contacts.map((c) => (
                        <li key={c.id}>
                            <article className="contact-card">
                                <header>
                                    <h3 className="contact-card__name">{c.name}</h3>
                                </header>
                                {c.photo && (
                                    <img
                                        src={c.photo}
                                        alt={`Picture of ${c.name}`}
                                        width="96"
                                        height="96"
                                        loading="lazy"
                                        style={{borderRadius:"50%", display:"block", marginBlock:"0.5rem"}}
                                    />
                                )}
                                <p className="contact-card__phone">
                                    <strong>Phone:</strong> <a href={`tel:${c.phone}`}>{c.phone}</a>
                                </p>
                                <p className="contact-card__email">
                                    <strong>Email:</strong> <a href={`mailto:${c.email}`}>{c.email}</a>
                                </p>
                            </article>
                        </li>
                    ))}
                </ul>
            </section>

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
                        <button className="btn" type="submit" data-testid="btn-add">
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
};

export default App;
