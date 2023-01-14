import React, { useState , useEffect} from "react";
import logo from '../assets/logo/logo_nero.svg';
import { Dropdown, Avatar } from "antd";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTv, faComment, faLink, faUser } from '@fortawesome/free-solid-svg-icons';
import LogoutButton from "../partials/auth/logout-button";
import { useNavigate } from "react-router-dom";


const Header = ({currentSelection}) => {

    const navigate = useNavigate();
    
    const [current_section, setCurrentSection] = useState(undefined);

    useEffect(()=>{

        setCurrentSection(currentSelection);

    },[]);

    const handleChangeSection = async(path) => {

        navigate(path);

    }

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
                    <li className={`nav-item ${current_section == 1 ? "active" : ""}`}>
                        <FontAwesomeIcon icon={faLink} />
                        <a className="nav-link">
                            <button className="btn" onClick={() => handleChangeSection( '/connect')}>Connect</button>
                        </a>
                    </li>
                    <li className={`nav-item ${current_section === 2 ? "active" : ""}`}>
                        <FontAwesomeIcon icon={faComment} />
                        <a className="nav-link">
                            <button className="btn" onClick={() => handleChangeSection( '/chat')}>Chat</button>
                        </a>
                    </li>
                    <li className={`nav-item ${current_section === 0 ? "active" : ""}`}>
                        <FontAwesomeIcon icon={faTv} />
                        <a className="nav-link">
                            <button className="btn" onClick={() => handleChangeSection( '/live')}>Live</button>
                        </a>
                    </li>

                    <li className={`nav-item ${current_section === 3 ? "active" : ""}`}>
                        <FontAwesomeIcon icon={faUser} />
                        <a className="nav-link">
                            <button className="btn" onClick={() => handleChangeSection( '/userpage')}>Profile</button>
                        </a>
                    </li>
                    
                </ul>

                </div>
                
                <LogoutButton></LogoutButton>

            </div>
        </nav>
    );
}

export default Header;
