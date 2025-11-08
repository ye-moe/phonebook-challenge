import { useState, useEffect } from "react";
import "./App.css";

import ada from "./assets/avatars/ada.png";
import alan from "./assets/avatars/alan.jpg";
import grace from "./assets/avatars/grace.jpg";
import john from "./assets/avatars/john.png";
import jane from "./assets/avatars/jane.jpg";

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
];

// For form validation
const validateForm = (form) => {
    const errors = {};
    
    if (!form.name || form.name.trim().length < 2) {
        errors.name = "Name must be at least 2 characters";
    }
    
    if (!form.phone || form.phone.trim().length === 0) {
        errors.phone = "Phone is required";
    }
    
    if (form.email && !form.email.includes("@")) {
        errors.email = "Email must include @";
    }
    
    return errors;
};

// Highlight matching text
const highlightMatch = (text, query) => {
    if (!query) return text; 
    
    const index = text.toLowerCase().indexOf(query.toLowerCase()); 
    if (index === -1) return text;
    
    const before = text.slice(0, index);
    const match = text.slice(index, index + query.length);
    const after = text.slice(index + query.length);
    
    return (
        <>
            {before}
            <mark className="highlight">{match}</mark>
            {after}
        </>
    );
};

export default function App() {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [query, setQuery] = useState("");
    const [form, setForm] = useState({ name: "", phone: "", email: "" });
    const [formErrors, setFormErrors] = useState({});
    const [isAdding, setIsAdding] = useState(false);

    // Fetch contacts from JSON file
    useEffect(() => {
        const fetchContacts = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // Try to load from localStorage first
                const stored = localStorage.getItem("phonebook_contacts");
                if (stored) {
                    const parsed = JSON.parse(stored);
                    setContacts(parsed);
                    setLoading(false);
                    return;
                }
                
                // Fetch from JSON file
                const response = await fetch("/data/contacts.json");
                if (!response.ok) {
                    throw new Error("Failed to fetch contacts");
                }
                
                const data = await response.json();
                
                // Add photos to fetched contacts
                const photosMap = { ada, alan, grace, john, jane };
                const contactsWithPhotos = data.map((contact, idx) => ({
                    ...contact,
                    photo: Object.values(photosMap)[idx % 5],
                }));
                
                setContacts(contactsWithPhotos);
                localStorage.setItem("phonebook_contacts", JSON.stringify(contactsWithPhotos));
            } catch (err) {
                console.error("Fetch error:", err);
                setError("Could not load contacts. Using fallback data.");
                setContacts(FALLBACK_CONTACTS);
            } finally {
                setLoading(false);
            }
        };

        fetchContacts();
    }, []);

    // Save to localStorage whenever contacts change
    useEffect(() => {
        if (contacts.length > 0 && !loading) {
            localStorage.setItem("phonebook_contacts", JSON.stringify(contacts));
        }
    }, [contacts, loading]);

    // Filter contacts based on search query
    const filteredContacts = contacts.filter((c) =>
        [c.name, c.phone].some((v) => 
            v.toLowerCase().includes(query.toLowerCase())
        )
    );

    const [page, setPage] = useState(1);
    const contactsPerPage = 1;
    const totalPages = Math.ceil(filteredContacts.length / contactsPerPage);
    const startIndex = (page - 1) * contactsPerPage;
    const currentContacts = filteredContacts.slice(
        startIndex,
        startIndex + contactsPerPage
    );

    // Reset to page 1 when search changes
    useEffect(() => {
        setPage(1);
    }, [query]);

    // Handle form submission with validation
    function handleSubmit() {
        const errors = validateForm(form);
        setFormErrors(errors);
        
        if (Object.keys(errors).length > 0) {
            return;
        }
        
        const newContact = {
            id: Date.now(),
            ...form,
            photo: john,
        };
        
        // Add to top of list
        setContacts([newContact, ...contacts]);
        setForm({ name: "", phone: "", email: "" });
        setFormErrors({});
        setIsAdding(false);
        setPage(1);
    }

    const renderPagination = () => {
        if (totalPages <= 1) return null;

        const pages = [];
        const showEllipsis = totalPages > 7;

        if (showEllipsis) {
            pages.push(1);
            if (page > 3) pages.push("...");
            for (
                let i = Math.max(2, page - 1);
                i <= Math.min(totalPages - 1, page + 1);
                i++
            ) {
                pages.push(i);
            }
            if (page < totalPages - 2) pages.push("...");
            pages.push(totalPages);
        } else {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        }

        return (
            <div className="pagination-container">
                <div className="pagination">
                    <button
                        onClick={() => setPage(Math.max(1, page - 1))}
                        disabled={page === 1}
                        className="pagination-arrow"
                        aria-label="Previous page"
                    >
                        ←
                    </button>

                    {pages.map((p, idx) =>
                        p === "..." ? (
                            <span
                                key={`ellipsis-${idx}`}
                                className="pagination-ellipsis"
                            >
                                ...
                            </span>
                        ) : (
                            <button
                                key={p}
                                onClick={() => setPage(p)}
                                className={`pagination-btn ${page === p ? "active" : ""}`}
                            >
                                {p}
                            </button>
                        )
                    )}

                    <button
                        onClick={() => setPage(Math.min(totalPages, page + 1))}
                        disabled={page === totalPages}
                        className="pagination-arrow"
                        aria-label="Next page"
                    >
                        →
                    </button>
                </div>
            </div>
        );
    };

    // Loading state
    if (loading) {
        return (
            <div className="modern-app">
                <div className="bg-orb bg-orb-1"></div>
                <div className="bg-orb bg-orb-2"></div>
                <main className="modern-container">
                    <div className="loading-container">
                        <div className="spinner"></div>
                        <p>Loading contacts...</p>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="modern-app">
            <div className="bg-orb bg-orb-1"></div>
            <div className="bg-orb bg-orb-2"></div>

            <main className="modern-container">
                <header className="modern-header">
                    <div className="hero-icon">
                        <svg
                            width="40"
                            height="40"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                        </svg>
                    </div>
                    <h1 className="modern-title">Phonebook</h1>
                    <p className="modern-subtitle">Your modern contact directory</p>
                </header>

                {/* Error message */}
                {error && (
                    <div className="error-banner">
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        {error}
                    </div>
                )}

                <section className="search-section" aria-labelledby="search-heading">
                    <h2 id="search-heading" className="section-heading">
                        Search Contacts
                    </h2>
                    <div className="search-wrapper">
                        <svg
                            className="search-icon"
                            width="20"
                            height="20"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                        <input
                            type="search"
                            placeholder="Search contacts by name or phone..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="modern-search"
                        />
                    </div>
                    <p className="search-results">
                        {filteredContacts.length}{" "}
                        {filteredContacts.length === 1 ? "contact" : "contacts"} found
                    </p>
                </section>

                <section className="add-section" aria-labelledby="add-heading">
                    <h2 id="add-heading" className="section-heading">
                        Add New Contact
                    </h2>
                    <button
                        onClick={() => {
                            setIsAdding(!isAdding);
                            setFormErrors({});
                        }}
                        className="add-btn"
                    >
                        <span className="add-icon">{isAdding ? "✕" : "+"}</span>
                        {isAdding ? "Cancel" : "Add New Contact"}
                    </button>
                </section>

                {isAdding && (
                    <section className="form-section">
                        <div className="modern-form">
                            <div className="form-grid">
                                <div className="form-field">
                                    <label htmlFor="name">Name *</label>
                                    <input
                                        id="name"
                                        type="text"
                                        value={form.name}
                                        onChange={(e) => {
                                            setForm({ ...form, name: e.target.value });
                                            if (formErrors.name) {
                                                setFormErrors({ ...formErrors, name: undefined });
                                            }
                                        }}
                                        className={`modern-input ${formErrors.name ? "error" : ""}`}
                                    />
                                    {formErrors.name && (
                                        <span className="error-message">{formErrors.name}</span>
                                    )}
                                </div>
                                <div className="form-field">
                                    <label htmlFor="phone">Phone *</label>
                                    <input
                                        id="phone"
                                        type="tel"
                                        placeholder="(555) 555-5555"
                                        value={form.phone}
                                        onChange={(e) => {
                                            setForm({ ...form, phone: e.target.value });
                                            if (formErrors.phone) {
                                                setFormErrors({ ...formErrors, phone: undefined });
                                            }
                                        }}
                                        className={`modern-input ${formErrors.phone ? "error" : ""}`}
                                    />
                                    {formErrors.phone && (
                                        <span className="error-message">{formErrors.phone}</span>
                                    )}
                                </div>
                            </div>
                            <div className="form-field">
                                <label htmlFor="email">Email</label>
                                <input
                                    id="email"
                                    type="email"
                                    value={form.email}
                                    onChange={(e) => {
                                        setForm({ ...form, email: e.target.value });
                                        if (formErrors.email) {
                                            setFormErrors({ ...formErrors, email: undefined });
                                        }
                                    }}
                                    className={`modern-input ${formErrors.email ? "error" : ""}`}
                                />
                                {formErrors.email && (
                                    <span className="error-message">{formErrors.email}</span>
                                )}
                            </div>
                            <button onClick={handleSubmit} className="save-btn">
                                Save Contact
                            </button>
                        </div>
                    </section>
                )}

                <section className="contacts-section" aria-labelledby="contacts-heading">
                    <h2 id="contacts-heading" className="section-heading">
                        Contact Directory
                    </h2>
                    <ul className="contacts-grid">
                        {currentContacts.map((contact, index) => (
                            <li
                                key={contact.id}
                                className="modern-card"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className="card-content">
                                    <div className="avatar-wrapper">
                                        <img
                                            src={contact.photo}
                                            alt={`Portrait of ${contact.name}`}
                                            className="modern-avatar"
                                        />
                                        <div className="status-indicator"></div>
                                    </div>
                                    <div className="contact-info">
                                        <h3 className="contact-name">
                                            {highlightMatch(contact.name, query)}
                                        </h3>
                                        <a
                                            href={`tel:${contact.phone}`}
                                            className="contact-detail"
                                        >
                                            <svg
                                                width="16"
                                                height="16"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                                />
                                            </svg>
                                            <span>{highlightMatch(contact.phone, query)}</span>
                                        </a>
                                        {contact.email && (
                                            <a
                                                href={`mailto:${contact.email}`}
                                                className="contact-detail"
                                            >
                                                <svg
                                                    width="16"
                                                    height="16"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                                    />
                                                </svg>
                                                <span>{contact.email}</span>
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>

                    {renderPagination()}
                </section>

                <footer className="modern-footer">
                    <p>Modern Phonebook Application • {new Date().getFullYear()}</p>
                </footer>
            </main>
        </div>
    );
}