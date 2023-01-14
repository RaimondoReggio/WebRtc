import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Header from "../general/header";
import Content from "../general/content";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVenusMars, faCakeCandles, faEarthAmerica, faBriefcase} from "@fortawesome/free-solid-svg-icons";
import Axios from "axios";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

// Componente utilizzato per visualizzare i dati del profilo di un altro utente

const StrangerPage = () => {

    const BASE_URL = process.env.REACT_APP_SERVER_URL;

    const {getAccessTokenSilently} = useAuth0();

    // Variabili utente
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
    const [points, setPoints] = useState();
    const [email, setEmail] = useState();

    const [goal1, setGoal1] = useState('');
    const [goal2, setGoal2] = useState('');
    const [goal3, setGoal3] = useState('');
    const [goal4, setGoal4] = useState('');

    const [hobbie1, setHobbie1] = useState('');
    const [hobbie2, setHobbie2] = useState('');
    const [hobbie3, setHobbie3] = useState('');
    const [hobbie4, setHobbie4] = useState('');

    const navigate = useNavigate();

    const location = useLocation();

    // Preleva userId Auth0 dell'utente di cui si vuole visualizzare il profilo
    let userId = location.state.userId;

    // Preleva le informazioni dell'utente tramite API
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
                setPoints(response.data.points.toFixed(1));
                setGoal1(response.data.goals[0]);
                setGoal2(response.data.goals[1]);
                setGoal3(response.data.goals[2]);
                setGoal4(response.data.goals[3]);
                setHobbie1(response.data.hobbies[0]);
                setHobbie2(response.data.hobbies[1]);
                setHobbie3(response.data.hobbies[2]);
                setHobbie4(response.data.hobbies[3]);
            }
        });
    };


    useEffect(() => {
        getStrangerData();
    },[]);

    // Invocata quando si decide di avviare una conversazione con il nuovo contatto
    const handleClick = async() => {
        
        const token = await getAccessTokenSilently();

        // L'utente viene aggiunto come nuovo contatto 
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
            {
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
                                    <button type="button" className="btn btn-primary btn-msg" onClick={() => {handleClick()}}>Message</button>
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
                                    <p className="mb-0" style={{textTransform:"capitalize"}}>{birth_country}</p>
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
                                    <p className="mb-0">Points</p>
                                    </div>
                                    <div className="col-sm-9">
                                    <p className="text-muted mb-0">{points}</p>
                                    </div>
                                </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                <div className="card card-goals mb-4 mb-md-0">
                                    <div className="card-body">
                                        <p className="mb-4">Why I want to learn a new language</p>
                                        { !goal1 && !goal2 && !goal3 && !goal4 &&
                                        <h4 className="no-item-message">No goal chosen</h4>
                                        }
                                        { goal1 &&
                                        <>
                                        <p className="mb-1" style={{fontSize: '.77rem'}}>{goal1}</p>
                                        <div className="progress rounded" style={{height: '5px'}}>
                                            <div className="progress-bar" role="progressbar" style={{width: '80%'}} aria-valuenow={80} aria-valuemin={0} aria-valuemax={100} />
                                        </div>
                                        </>
                                        }
                                        { goal2 &&
                                        <>
                                        <p className="mt-4 mb-1" style={{fontSize: '.77rem'}}>{goal2}</p>
                                        <div className="progress rounded" style={{height: '5px'}}>
                                            <div className="progress-bar" role="progressbar" style={{width: '72%'}} aria-valuenow={72} aria-valuemin={0} aria-valuemax={100} />
                                        </div>
                                        </>
                                        }
                                        { goal3 && 
                                        <>
                                        <p className="mt-4 mb-1" style={{fontSize: '.77rem'}}>{goal3}</p>
                                        <div className="progress rounded" style={{height: '5px'}}>
                                            <div className="progress-bar" role="progressbar" style={{width: '89%'}} aria-valuenow={72} aria-valuemin={0} aria-valuemax={100} />
                                        </div>
                                        </>
                                        }
                                        { goal4 && 
                                        <>
                                        <p className="mt-4 mb-1" style={{fontSize: '.77rem'}}>{goal4}</p>
                                        <div className="progress rounded" style={{height: '5px'}}>
                                            <div className="progress-bar" role="progressbar" style={{width: '55%'}} aria-valuenow={72} aria-valuemin={0} aria-valuemax={100} />
                                        </div>
                                        </>
                                        }
                                    </div>
                                </div>
                                </div>
                                <div className="col-md-6">
                                <div className="card card-hobbies mb-4 mb-md-0">
                                    <div className="card-body">
                                    <p className="mb-4">Hobbies</p>
                                    { !hobbie1 && !hobbie2 && !hobbie3 && !hobbie4 &&
                                    <h4 className="no-item-message">No hobbie chosen</h4>
                                    }
                                    { hobbie1 && 
                                    <>
                                    <p className="mb-1" style={{fontSize: '.77rem'}}>{hobbie1}</p>
                                    <div className="progress rounded" style={{height: '5px'}}>
                                        <div className="progress-bar" role="progressbar" style={{width: '80%'}} aria-valuenow={80} aria-valuemin={0} aria-valuemax={100} />
                                    </div>
                                    </>
                                    }
                                    { hobbie2 && 
                                    <>
                                    <p className="mt-4 mb-1" style={{fontSize: '.77rem'}}>{hobbie2}</p>
                                    <div className="progress rounded" style={{height: '5px'}}>
                                        <div className="progress-bar" role="progressbar" style={{width: '72%'}} aria-valuenow={72} aria-valuemin={0} aria-valuemax={100} />
                                    </div>
                                    </>
                                    }
                                    { hobbie3 && 
                                    <>
                                    <p className="mt-4 mb-1" style={{fontSize: '.77rem'}}>{hobbie3}</p>
                                    <div className="progress rounded" style={{height: '5px'}}>
                                        <div className="progress-bar" role="progressbar" style={{width: '89%'}} aria-valuenow={72} aria-valuemin={0} aria-valuemax={100} />
                                    </div>
                                    </>
                                    }
                                    { hobbie4 && 
                                    <>
                                    <p className="mt-4 mb-1" style={{fontSize: '.77rem'}}>{hobbie4}</p>
                                    <div className="progress rounded" style={{height: '5px'}}>
                                        <div className="progress-bar" role="progressbar" style={{width: '55%'}} aria-valuenow={72} aria-valuemin={0} aria-valuemax={100} />
                                    </div>
                                    </>
                                    }
                                    </div>
                                </div>
                                </div>
                            </div>
                            </div>
                        </div>
                    </div>
                </section>
            }
        </Content>
        </>
    );
};

export default StrangerPage;