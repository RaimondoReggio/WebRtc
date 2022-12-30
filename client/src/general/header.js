import React from "react";
import logo from '../assets/logo/logo_nero.svg';
import { Dropdown, Avatar } from "antd";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTv, faComment, faLink } from '@fortawesome/free-solid-svg-icons';
import LogoutButton from "../partials/auth/logout-button";

const Header = () => {

    const items = [
    {
        key: '1',
        label: (
        <a target="_blank" rel="noopener noreferrer">
            <button>Profile</button>
        </a>
        ),
    },
    {
        key: '2',
        label: (
            <LogoutButton></LogoutButton>
        ),
    },
    ];


    return (
        <nav className="navbar navbar-expand-lg navbar-light nav-header">
            <div className="container-fluid">
                <button
                className="navbar-toggler"
                type="button"
                data-mdb-toggle="collapse"
                data-mdb-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
                >
                <i className="fas fa-bars"></i>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <a className="navbar-brand mt-2 mt-lg-0">
                    <img
                    src={logo}
                    height="15"
                    alt="logo-black"
                    loading="lazy"
                    />
                </a>

                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                    <li className="nav-item">
                        <FontAwesomeIcon icon={faTv} />
                        <a className="nav-link">Live</a>
                    </li>
                    <li className="nav-item">
                        <FontAwesomeIcon icon={faLink} />
                        <a className="nav-link">Connect</a>
                    </li>
                    <li className="nav-item active">
                        <FontAwesomeIcon icon={faComment} />
                        <a className="nav-link">Chat</a>
                    </li>
                </ul>

                </div>

                <div className="user-drop-down d-flex align-items-center">
                    <Dropdown className="user-dropdown" menu={{ items }} placement="bottomLeft">
                        <Avatar src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp"></Avatar>
                    </Dropdown>
                </div>
            </div>
        </nav>
    );
}

export default Header;
