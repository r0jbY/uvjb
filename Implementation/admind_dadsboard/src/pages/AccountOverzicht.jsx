import React, { useEffect, useState } from "react";

const AccountOverzicht = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);

    const [newUser, setNewUser] = useState({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
    });

    const [editingUser, setEditingUser] = useState(null);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:8080/api/users", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch users");
            }

            const data = await response.json();
            setUsers(data);
        } catch (err) {
            setError(err.message);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleCreateAccount = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch("http://localhost:8080/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newUser),
            });

            if (!response.ok) {
                throw new Error("Failed to create account");
            }

            setNewUser({ firstname: "", lastname: "", email: "", password: "" });
            fetchUsers();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleUpdateUser = async (id) => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:8080/api/users/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(editingUser),
            });

            if (!response.ok) {
                throw new Error("Failed to update user");
            }

            setEditingUser(null);
            fetchUsers();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDeleteUser = async (id) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:8080/api/users/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to delete user");
            }

            fetchUsers();
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>Account Overzicht</h2>
            {error && <p style={{ color: "red" }}>Error: {error}</p>}

            {/* Create New Account Form */}
            <form onSubmit={handleCreateAccount} style={{ marginBottom: "20px" }}>
                <h3>Create New Account</h3>
                <input
                    type="text"
                    placeholder="First Name"
                    value={newUser.firstname}
                    onChange={(e) => setNewUser({ ...newUser, firstname: e.target.value })}
                    required
                />
                <input
                    type="text"
                    placeholder="Last Name"
                    value={newUser.lastname}
                    onChange={(e) => setNewUser({ ...newUser, lastname: e.target.value })}
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    required
                />
                <button type="submit">Create Account</button>
            </form>

            {/* Users Table */}
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Address</th>
                        <th>Phone Number</th>
                        <th>Active</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.firstname}</td>
                            <td>{user.lastname}</td>
                            <td>{user.email}</td>
                            <td>{user.adress}</td>
                            <td>{user.phonenumber}</td>
                            <td>{user.active ? "Active" : "Inactive"}</td>
                            <td>{user.role}</td>
                            <td>
                                <button onClick={() => setEditingUser(user)}>Edit</button>
                                <button onClick={() => handleDeleteUser(user.id)} style={{ color: "red" }}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Edit User Form */}
            {editingUser && (
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleUpdateUser(editingUser.id);
                    }}
                    style={{ marginTop: "20px" }}
                >
                    <h3>Edit User: {editingUser.firstname} {editingUser.lastname}</h3>
                    <label>
                        First Name:
                        <input
                            type="text"
                            value={editingUser.firstname}
                            onChange={(e) => setEditingUser({ ...editingUser, firstname: e.target.value })}
                            required
                        />
                    </label>
                    <label>
                        Last Name:
                        <input
                            type="text"
                            value={editingUser.lastname}
                            onChange={(e) => setEditingUser({ ...editingUser, lastname: e.target.value })}
                            required
                        />
                    </label>
                    <label>
                        Email:
                        <input
                            type="email"
                            value={editingUser.email}
                            onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                            required
                        />
                    </label>
                    <label>
                        Address:
                        <input
                            type="text"
                            value={editingUser.adress}
                            onChange={(e) => setEditingUser({ ...editingUser, adress: e.target.value })}
                            required
                        />
                    </label>
                    <label>
                        Phone Number:
                        <input
                            type="text"
                            value={editingUser.phonenumber}
                            onChange={(e) => setEditingUser({ ...editingUser, phonenumber: e.target.value })}
                            required
                        />
                    </label>
                    <label>
                        Active:
                        <select
                            value={editingUser.active}
                            onChange={(e) => setEditingUser({ ...editingUser, active: e.target.value === "true" })}
                        >
                            <option value="true">Active</option>
                            <option value="false">Inactive</option>
                        </select>
                    </label>
                    <label>
                        Role:
                        <select
                            value={editingUser.role}
                            onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                        >
                            <option value="USER">User</option>
                            <option value="ADMIN">Admin</option>
                        </select>
                    </label>
                    <button type="submit">Update User</button>
                    <button type="button" onClick={() => setEditingUser(null)}>Cancel</button>
                </form>
            )}
        </div>
    );
};

export default AccountOverzicht;
