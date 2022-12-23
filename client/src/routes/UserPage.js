import React, { useState } from "react";
import logoBlack from '../assets/logo/logo_nero.svg'
import { useAuth0 } from "@auth0/auth0-react";
import Header from "../general/header";
import Content from "../general/content";
import { Select } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVenusMars, faCakeCandles, faEarthAmerica, faHouseUser, faBriefcase} from "@fortawesome/free-solid-svg-icons";

const Profile = () => {
    const { user } = useAuth0();
    const { nickname, picture, email } = user;

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
                            <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp" alt="avatar" className="rounded-circle img-fluid" style={{width: '150px'}} />
                            <h5 className="my-3">Profyeye</h5>
                            <p className="text-muted mb-4">I love travel and I would like to go in USA</p>
                            <div className="d-flex justify-content-center mb-2">
                                <button type="button" className="btn btn-primary btn-msg">Message</button>
                                <button type="button" className="btn btn-outline-primary btn-like ms-1">Like</button>
                            </div>
                            </div>
                        </div>
                        <div className="card mb-4 mb-lg-0">
                            <div className="card-body p-0">
                            <ul className="list-group list-group-flush rounded-3">
                                <li className="list-group-item d-flex justify-content-between align-items-center p-3 selected">
                                <FontAwesomeIcon icon={faVenusMars} />
                                <p className="mb-0">Male</p>
                                </li>
                                <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                                <FontAwesomeIcon icon={faCakeCandles} />
                                <p className="mb-0">22-Dec-1999</p>
                                </li>
                                <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                                <FontAwesomeIcon icon={faEarthAmerica} />
                                <p className="mb-0">Italy</p>
                                </li>
                                <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                                <FontAwesomeIcon icon={faBriefcase} />
                                <p className="mb-0">Student</p>
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
                                <p className="text-muted mb-0">Reggio Raimondo</p>
                                </div>
                            </div>
                            <hr />
                            <div className="row">
                                <div className="col-sm-3">
                                <p className="mb-0">Email</p>
                                </div>
                                <div className="col-sm-9">
                                <p className="text-muted mb-0">reggioraimondo@gmail.com</p>
                                </div>
                            </div>
                            <hr />
                            <div className="row">
                                <div className="col-sm-3">
                                <p className="mb-0">Wants to teach</p>
                                </div>
                                <div className="col-sm-9">
                                <p className="text-muted mb-0">Italian</p>
                                </div>
                            </div>
                            <hr />
                            <div className="row">
                                <div className="col-sm-3">
                                <p className="mb-0">Wants to learn</p>
                                </div>
                                <div className="col-sm-9">
                                <p className="text-muted mb-0">English</p>
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

export default Profile;