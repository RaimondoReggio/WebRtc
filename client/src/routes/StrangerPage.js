import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Header from "../general/header";
import Content from "../general/content";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVenusMars, faCakeCandles, faEarthAmerica, faHouseUser, faBriefcase} from "@fortawesome/free-solid-svg-icons";
import Axios from "axios";
import axios from 'axios';
import { useLocation } from "react-router-dom";

import { useNavigate } from 'react-router-dom';

const StrangerPage = () => {

    // User data Auth0
    const { user } = useAuth0();

    // Server API url
    const BASE_URL = process.env.REACT_APP_SERVER_URL;

    // Gets token
    const {getAccessTokenSilently} = useAuth0();

    // User variables
    const [avatar_image, setAvatarImage] = useState();
    const [username, setUsername] = useState();
    const [biography, setBiography] = useState();
    const [gender, setGender] = useState();
    const [birth_date, setBirthDate] = useState();
    const [birth_country, setBirthCountry] = useState();
    const [job, setJob] = useState();
    const [first_name, setFirstName] = useState();
    const [last_name, setLasttName] = useState();
    const [native_l, setNative_l] = useState();
    const [new_l, setNew_l] = useState();
    const [email, setEmail] = useState();
    const navigate = useNavigate();

    const location = useLocation();

    // get userId
    let userId = location.state.userId;

    // Retrives all user data
    const getStrangerData = async() => {
        const token = await getAccessTokenSilently();

        await Axios.get(BASE_URL+'/getStrangerData', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: {
                user_id: userId
            }
        }).then((response) => {
            if(response.data) {
                setAvatarImage(response.data.avatar_image);
                setUsername(response.data.username);
                setBiography(response.data.biography);
                setGender(response.data.gender);
                setBirthDate(response.data.birth_date);
                setBirthCountry(response.data.birth_country);
                setJob(response.data.job);
                setFirstName(response.data.first_name);
                setLasttName(response.data.last_name);
                setNative_l(response.data.native_l);
                setNew_l(response.data.new_l);
                setEmail(response.data.email);
            }
        });
    };

    useEffect(() => {
        getStrangerData();
    });

    const handleClick = async() => {
        
        const token = await getAccessTokenSilently();

        await axios({method: 'post', url: BASE_URL + '/addContact', 
            headers: {'Authorization': `Bearer ${token}`}, 
            params : {
                contact_id: userId,
            } 
        }).then((response) => {
            navigate('/chat');
        });

        
    }

    return (
        <>
        <Header></Header>
        <Content>
            <section className="user-page-container" style={{backgroundColor: '#fff'}}>
                <div className="container py-5">
                    <div className="row">
                        <div className="col-lg-4">
                        <div className="card user-card mb-4">
                            <div className="card-body text-center">
                            <img src={avatar_image} alt="avatar" className="rounded-circle img-fluid" style={{width: '150px'}} />
                            <h5 className="my-3">{username}</h5>
                            <p className="text-muted mb-4">{biography}</p>
                            <div className="d-flex justify-content-center mb-2">
                                <button type="button" className="btn btn-primary btn-msg" onClick={() => handleClick()}>Message</button>
                                <button type="button" className="btn btn-outline-primary btn-like ms-1">Like</button>
                            </div>
                            </div>
                        </div>
                        <div className="card mb-4 mb-lg-0">
                            <div className="card-body p-0">
                            <ul className="list-group list-group-flush rounded-3">
                                <li className="list-group-item d-flex justify-content-between align-items-center p-3 selected">
                                <FontAwesomeIcon icon={faVenusMars} />
                                <p className="mb-0">{gender}</p>
                                </li>
                                <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                                <FontAwesomeIcon icon={faCakeCandles} />
                                <p className="mb-0">{birth_date}</p>
                                </li>
                                <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                                <FontAwesomeIcon icon={faEarthAmerica} />
                                <p className="mb-0">{birth_country}</p>
                                </li>
                                <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                                <FontAwesomeIcon icon={faBriefcase} />
                                <p className="mb-0">{job}</p>
                                </li>
                            </ul>
                            </div>
                        </div>
                        </div>
                        <div className="col-lg-8">
                        <div className="card mb-4">
                            <div className="card-body">
                            <div className="row">
                                <div className="col-sm-3">
                                <p className="mb-0">Full Name</p>
                                </div>
                                <div className="col-sm-9">
                                <p className="text-muted mb-0">{first_name + ' ' + last_name}</p>
                                </div>
                            </div>
                            <hr />
                            <div className="row">
                                <div className="col-sm-3">
                                <p className="mb-0">Email</p>
                                </div>
                                <div className="col-sm-9">
                                <p className="text-muted mb-0">{email}</p>
                                </div>
                            </div>
                            <hr />
                            <div className="row">
                                <div className="col-sm-3">
                                <p className="mb-0">Wants to teach</p>
                                </div>
                                <div className="col-sm-9">
                                <p className="text-muted mb-0" style={{textTransform:'capitalize'}}>{native_l}</p>
                                </div>
                            </div>
                            <hr />
                            <div className="row">
                                <div className="col-sm-3">
                                <p className="mb-0">Wants to learn</p>
                                </div>
                                <div className="col-sm-9">
                                <p className="text-muted mb-0" style={{textTransform:'capitalize'}}>{new_l}</p>
                                </div>
                            </div>
                            <hr />
                            <div className="row">
                                <div className="col-sm-3">
                                <p className="mb-0">Like</p>
                                </div>
                                <div className="col-sm-9">
                                <p className="text-muted mb-0">100</p>
                                </div>
                            </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                            <div className="card mb-4 mb-md-0">
                                <div className="card-body">
                                    <p className="mb-4">Why I want to learn a new language</p>
                                    <p className="mb-1" style={{fontSize: '.77rem'}}>Travel</p>
                                    <div className="progress rounded" style={{height: '5px'}}>
                                        <div className="progress-bar" role="progressbar" style={{width: '80%'}} aria-valuenow={80} aria-valuemin={0} aria-valuemax={100} />
                                    </div>
                                    <p className="mt-4 mb-1" style={{fontSize: '.77rem'}}>Job</p>
                                    <div className="progress rounded" style={{height: '5px'}}>
                                        <div className="progress-bar" role="progressbar" style={{width: '72%'}} aria-valuenow={72} aria-valuemin={0} aria-valuemax={100} />
                                    </div>
                                    <p className="mt-4 mb-1" style={{fontSize: '.77rem'}}>Study</p>
                                    <div className="progress rounded" style={{height: '5px'}}>
                                        <div className="progress-bar" role="progressbar" style={{width: '89%'}} aria-valuenow={89} aria-valuemin={0} aria-valuemax={100} />
                                    </div>
                                    <p className="mt-4 mb-1" style={{fontSize: '.77rem'}}>Interest</p>
                                    <div className="progress rounded" style={{height: '5px'}}>
                                        <div className="progress-bar" role="progressbar" style={{width: '55%'}} aria-valuenow={55} aria-valuemin={0} aria-valuemax={100} />
                                    </div>
                                </div>
                            </div>
                            </div>
                            <div className="col-md-6">
                            <div className="card mb-4 mb-md-0">
                                <div className="card-body">
                                <p className="mb-4">Hobbies</p>
                                <p className="mb-1" style={{fontSize: '.77rem'}}>Anime/Manga</p>
                                <div className="progress rounded" style={{height: '5px'}}>
                                    <div className="progress-bar" role="progressbar" style={{width: '80%'}} aria-valuenow={80} aria-valuemin={0} aria-valuemax={100} />
                                </div>
                                <p className="mt-4 mb-1" style={{fontSize: '.77rem'}}>Web Developing</p>
                                <div className="progress rounded" style={{height: '5px'}}>
                                    <div className="progress-bar" role="progressbar" style={{width: '72%'}} aria-valuenow={72} aria-valuemin={0} aria-valuemax={100} />
                                </div>
                                <p className="mt-4 mb-1" style={{fontSize: '.77rem'}}>Sports</p>
                                <div className="progress rounded" style={{height: '5px'}}>
                                    <div className="progress-bar" role="progressbar" style={{width: '89%'}} aria-valuenow={89} aria-valuemin={0} aria-valuemax={100} />
                                </div>
                                <p className="mt-4 mb-1" style={{fontSize: '.77rem'}}>Party</p>
                                <div className="progress rounded mb-2" style={{height: '5px'}}>
                                    <div className="progress-bar" role="progressbar" style={{width: '66%'}} aria-valuenow={66} aria-valuemin={0} aria-valuemax={100} />
                                </div>
                                </div>
                            </div>
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
            </section>
        </Content>
        </>
    );
};

export default StrangerPage;