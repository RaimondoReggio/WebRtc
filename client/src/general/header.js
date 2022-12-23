import React from "react";
import logo from '../assets/logo/logo_nero.svg';
import { Dropdown, Avatar } from "antd";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTv, faComment, faLink } from '@fortawesome/free-solid-svg-icons'

const Header = () => {

    const items = [
    {
        key: '1',
        label: (
        <a target="_blank" rel="noopener noreferrer" href="">
            Profile
        </a>
        ),
    },
    {
        key: '2',
        label: (
        <a target="_blank" rel="noopener noreferrer" href="">
            Log out
        </a>
        ),
    },
    ];


    return (
        <nav class="navbar navbar-expand-lg navbar-light nav-header">
            <div class="container-fluid">
                <button
                class="navbar-toggler"
                type="button"
                data-mdb-toggle="collapse"
                data-mdb-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
                >
                <i class="fas fa-bars"></i>
                </button>

                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <a class="navbar-brand mt-2 mt-lg-0" href="#">
                    <img
                    src={logo}
                    height="15"
                    alt="logo-black"
                    loading="lazy"
                    />
                </a>

                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item">
                        <FontAwesomeIcon icon={faTv} />
                        <a class="nav-link" href="#">Live</a>
                    </li>
                    <li class="nav-item">
                        <FontAwesomeIcon icon={faLink} />
                        <a class="nav-link" href="#">Connect</a>
                    </li>
                    <li class="nav-item active">
                        <FontAwesomeIcon icon={faComment} />
                        <a class="nav-link" href="#">Chat</a>
                    </li>
                </ul>

                </div>

                <div class="d-flex align-items-center">
                    <Dropdown menu={{ items }} placement="bottomLeft">
                        <Avatar src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp"></Avatar>
                    </Dropdown>
                </div>
            </div>
        </nav>
    );
}

export default Header;
