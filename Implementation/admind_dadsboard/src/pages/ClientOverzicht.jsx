import React, { useEffect, useState } from "react";

const ClientOverzicht = () => {
    const [clients, setClients] = useState([]);
    const [error, setError] = useState(null);

    const [newClient, setNewClient] = useState({
        firstname: "",
        lastname: "",
        adress: "",
        devicecode: "",
        active: true,
    });

    const [editingClient, setEditingClient] = useState(null);

    const fetchClients = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:8080/api/client", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch clients");
            }

            const data = await response.json();
            setClients(data);
        } catch (err) {
            setError(err.message);
        }
    };

    useEffect(() => {
        fetchClients();
    }, []);

    const handleCreateClient = async (event) => {
        event.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:8080/api/client", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(newClient),
            });

            if (!response.ok) {
                throw new Error("Failed to create client");
            }

            setNewClient({ firstname: "", lastname: "", adress: "", devicecode: "", active: true });
            fetchClients();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleUpdateClient = async (id) => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:8080/api/client/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(editingClient),
            });

            if (!response.ok) {
                throw new Error("Failed to update client");
            }

            setEditingClient(null);
            fetchClients();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDeleteClient = async (id) => {
        if (!window.confirm("Are you sure you want to delete this client?")) return;

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:8080/api/client/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to delete client");
            }

            fetchClients();
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>Cliënt Overzicht</h2>
            {error && <p style={{ color: "red" }}>Error: {error}</p>}

            {/* Create New Client Form */}
            <form onSubmit={handleCreateClient} style={{ marginBottom: "20px" }}>
                <h3>Create New Client</h3>
                <input
                    type="text"
                    placeholder="First Name"
                    value={newClient.firstname}
                    onChange={(e) => setNewClient({ ...newClient, firstname: e.target.value })}
                    required
                />
                <input
                    type="text"
                    placeholder="Last Name"
                    value={newClient.lastname}
                    onChange={(e) => setNewClient({ ...newClient, lastname: e.target.value })}
                    required
                />
                <input
                    type="text"
                    placeholder="Address"
                    value={newClient.adress}
                    onChange={(e) => setNewClient({ ...newClient, adress: e.target.value })}
                    required
                />
                <input
                    type="text"
                    placeholder="Device Code"
                    value={newClient.devicecode}
                    onChange={(e) => setNewClient({ ...newClient, devicecode: e.target.value })}
                    required
                />
                <select
                    value={newClient.active}
                    onChange={(e) => setNewClient({ ...newClient, active: e.target.value === "true" })}
                >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                </select>
                <button type="submit">Create Client</button>
            </form>

            {/* Clients Table */}
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Address</th>
                        <th>Device Code</th>
                        <th>Active</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {clients.map((client) => (
                        <tr key={client.id}>
                            <td>{client.id}</td>
                            <td>{client.firstname}</td>
                            <td>{client.lastname}</td>
                            <td>{client.adress}</td>
                            <td>{client.devicecode}</td>
                            <td>{client.active ? "Active" : "Inactive"}</td>
                            <td>
                                <button onClick={() => setEditingClient(client)}>Edit</button>
                                <button onClick={() => handleDeleteClient(client.id)} style={{ color: "red" }}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Edit Client Form */}
            {editingClient && (
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleUpdateClient(editingClient.id);
                    }}
                    style={{ marginTop: "20px" }}
                >
                    <h3>Edit Client: {editingClient.firstname} {editingClient.lastname}</h3>
                    <input
                        type="text"
                        placeholder="First Name"
                        value={editingClient.firstname}
                        onChange={(e) => setEditingClient({ ...editingClient, firstname: e.target.value })}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Last Name"
                        value={editingClient.lastname}
                        onChange={(e) => setEditingClient({ ...editingClient, lastname: e.target.value })}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Address"
                        value={editingClient.adress}
                        onChange={(e) => setEditingClient({ ...editingClient, adress: e.target.value })}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Device Code"
                        value={editingClient.devicecode}
                        onChange={(e) => setEditingClient({ ...editingClient, devicecode: e.target.value })}
                        required
                    />
                    <select
                        value={editingClient.active}
                        onChange={(e) => setEditingClient({ ...editingClient, active: e.target.value === "true" })}
                    >
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                    </select>
                    <button type="submit">Update Client</button>
                    <button type="button" onClick={() => setEditingClient(null)}>Cancel</button>
                </form>
            )}
        </div>
    );
};

export default ClientOverzicht;
