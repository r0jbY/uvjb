import React from "react";
import { Link } from "react-router-dom";
import styles from "./NavBar.module.css";

const NavBar = ({ setIsLoggedIn }) => {
    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
    };

    return (
        <nav className={styles.navbar}>
            <div className={styles.logo}>MyApp</div>
            <ul className={styles.navLinks}>
                <li><Link to="/">Dashboard</Link></li>
                <li><Link to="/profile">Profile</Link></li>
                <li><Link to="/settings">Settings</Link></li>
                <li><Link to="/accounts">Account overzicht</Link></li>
                <li><Link to="/clients">Cliënt overzicht</Link></li>
                <li onClick={handleLogout} className={styles.logoutButton}>Logout</li>
            </ul>
        </nav>
    );
};

export default NavBar;
