import React, { useEffect, useState, useRef } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Header from "../general/header";
import Content from "../general/content";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVenusMars, faCakeCandles, faEarthAmerica, faHouseUser, faBriefcase} from "@fortawesome/free-solid-svg-icons";
import {Select, Input, Button, DatePicker, Steps, Avatar, Divider, Space, message } from "antd";
import TextArea from 'antd/es/input/TextArea';
import Axios from "axios";
import axios from "axios";
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

// Componente utilizzato per visualizzare i dati del profilo utente e modificarli

let goal_index = 0;
let hobbie_index = 0;

const Profile = () => {

    const { user } = useAuth0();
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
    const { email } = user;

    const [goal_items, setGoalItems] = useState(['travel', 'study']);
    const [goal1, setGoal1] = useState('');
    const [goal2, setGoal2] = useState('');
    const [goal3, setGoal3] = useState('');
    const [goal4, setGoal4] = useState('');
    const [new_goal, setNewGoal] = useState('');
    const inputRefGoals = useRef(null);
 
    const [hobbie_items, setHobbieItems] = useState(['play', 'party']);
    const [hobbie1, setHobbie1] = useState('');
    const [hobbie2, setHobbie2] = useState('');
    const [hobbie3, setHobbie3] = useState('');
    const [hobbie4, setHobbie4] = useState('');
    const [new_hobbie, setNewHobbie] = useState('');
    const inputRefHobbies = useRef(null);

    // Variabile di stato per pasare alla modalità Edit
    const [edit_mode, setEditMode] = useState(false);
    const dateFormat = 'YYYY/MM/DD';

    // Preleva i dati dell'utente tramite API
    const getUserData = async() => {
        const token = await getAccessTokenSilently();
        await Axios.get(BASE_URL+'/getUserData', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
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

    // Modifica dati utente tramite API
    const updateUser = async() => {
        const token = await getAccessTokenSilently();

        await axios({method: 'post', url: BASE_URL + '/updateUserProfile', 
            headers: {'Authorization': `Bearer ${token}`}, 
            params : {
                first_name: first_name,
                last_name: last_name,
                username: username, 
                native_l: native_l, 
                new_l: new_l,
                gender: gender,
                birth_date: birth_date,
                birth_country: birth_country,
                job: job,
                biography: biography,
                avatar_image: avatar_image,
                email: user.email,
                goals: [goal1, goal2, goal3, goal4],
                hobbies: [hobbie1, hobbie2, hobbie3, hobbie4],
            } 
        }).then(async(response) => {
            if(response.data.registered) {

                const user_data = {
                    id: user.sub,
                    username: username,
                    avatar_image: avatar_image,
                    native_l: native_l,
                    new_l: new_l,
                }
                localStorage.setItem('user-data', JSON.stringify(user_data));
                setEditMode(false);
            } else {
                alert(response.data.message);
            } 
        });
    }

    useEffect(() => {
        getUserData();
    },[]);

    const addItemGoal = (e) => {
        e.preventDefault();
        setGoalItems([...goal_items, new_goal || `New item ${goal_index++}`]);
        setNewGoal('');
        setTimeout(() => {
          inputRefGoals.current?.focus();
        }, 0);
    };

    const addItemHobbie = (e) => {
        e.preventDefault();
        setHobbieItems([...hobbie_items, new_hobbie || `New item ${hobbie_index++}`]);
        setNewHobbie('');
        setTimeout(() => {
        inputRefHobbies.current?.focus();
        }, 0);
    };

    return (
        <>
        <Header currentSelection={3}></Header>
        <Content>
            { !edit_mode && 
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
                                    <button type="button" className="btn btn-primary btn-msg" onClick={() => {setEditMode(true)}}>Edit</button>
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
            { edit_mode && 
                <section className="user-page-container" style={{backgroundColor: '#fff'}}>
                    <div className="container py-5">
                        <div className="row">
                            <div className="col-lg-4">
                            <div className="card user-card mb-4">
                                <div className="card-body text-center">
                                <img src={avatar_image} alt="avatar" className="rounded-circle img-fluid" style={{width: '150px'}} />
                                <h5 className="my-3">{username}</h5>
                                <TextArea rows={4} className="mb-3" placeholder="Write a short description of you" defaultValue={biography} maxLength={50} onChange={(e) => {setBiography(e.target.value)}}/>
                                <div className="d-flex justify-content-center mb-2">
                                    <button type="button" className="btn btn-primary btn-msg" onClick={() => updateUser()}>Save</button>
                                </div>
                                </div>
                            </div>
                            <div className="card mb-4 mb-lg-0">
                                <div className="card-body p-0">
                                <ul className="list-group list-group-flush rounded-3">
                                    <li className="list-group-item d-flex justify-content-between align-items-center p-3 selected">
                                    <FontAwesomeIcon icon={faVenusMars} />
                                    <Select
                                        showSearch
                                        placeholder="Select your gender"
                                        optionFilterProp="children"
                                        defaultValue={gender}
                                        onChange={(value) => {setGender(value)}}
                                        filterOption={(input, option) =>
                                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                        }
                                        options={[
                                        {
                                            value: 'male',
                                            label: 'Male',
                                        },
                                        {
                                            value: 'female',
                                            label: 'Female',
                                        },
                                        {
                                            value: 'other',
                                            label: 'Other',
                                        },
                                        ]}
                                    />
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                                    <FontAwesomeIcon icon={faCakeCandles} />
                                    <DatePicker placeholder="Your birth date" defaultValue={dayjs(birth_date, dateFormat)} onChange={(date, dateString) => {setBirthDate(dateString)}}/>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                                    <FontAwesomeIcon icon={faEarthAmerica} />
                                    <Select
                                        showSearch
                                        placeholder="Select your native country"
                                        optionFilterProp="children"
                                        defaultValue={birth_country}
                                        onChange={(value) => {setBirthCountry(value)}}
                                        filterOption={(input, option) =>
                                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                        }
                                        options={[
                                        {
                                            value: 'italy',
                                            label: 'Italy',
                                        },
                                        {
                                            value: 'spain',
                                            label: 'Spain',
                                        },
                                        {
                                            value: 'sweden',
                                            label: 'Sweden',
                                        },
                                        {
                                            value: 'england',
                                            label: 'England',
                                        },
                                        ]}
                                    />
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                                        <FontAwesomeIcon icon={faBriefcase} />
                                        <Input className="job-field" placeholder="Your job" defaultValue={job} onChange={(e) => {setJob(e.target.value)}}/>
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
                                        <div className="row">
                                            <div className="col-md-6">
                                                <Input placeholder="First Name" defaultValue={first_name} onChange={(e) => {setFirstName(e.target.value)}} />
                                            </div>
                                            <div className="col-md-6">
                                                <Input placeholder="Last Name" defaultValue={last_name} onChange={(e) => {setLasttName(e.target.value)}}/>
                                            </div>
                                        </div>
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
                                        <Select
                                            showSearch
                                            placeholder="Native Language"
                                            optionFilterProp="children"
                                            defaultValue={native_l}
                                            onChange={(value) => {setNative_l(value)}}
                                            filterOption={(input, option) =>
                                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                            }
                                            options={[
                                            {
                                                value: 'english',
                                                label: 'English',
                                            },
                                            {
                                                value: 'italian',
                                                label: 'Italian',
                                            },
                                            {
                                                value: 'spanish',
                                                label: 'Spanish',
                                            },
                                            {
                                                value: 'swedish',
                                                label: 'Swedish',
                                            },
                                            ]}
                                        />
                                    </div>
                                </div>
                                <hr />
                                <div className="row">
                                    <div className="col-sm-3">
                                    <p className="mb-0">Wants to learn</p>
                                    </div>
                                    <div className="col-sm-9">
                                        <Select
                                            showSearch
                                            placeholder="New Lenguage"
                                            optionFilterProp="children"
                                            defaultValue={new_l}
                                            onChange={(value) => {setNew_l(value)}}
                                            filterOption={(input, option) =>
                                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                            }
                                            options={[
                                                {
                                                    value: 'english',
                                                    label: 'English',
                                                },
                                                {
                                                    value: 'italian',
                                                    label: 'Italian',
                                                },
                                                {
                                                    value: 'spanish',
                                                    label: 'Spanish',
                                                },
                                                {
                                                    value: 'swedish',
                                                    label: 'Swedish',
                                                },
                                            ]}
                                        />
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
                                <div className="card mb-4 mb-md-0">
                                    <div className="card-body">
                                        <p className="mb-4">Why I want to learn a new language</p>
                                        <div className='form-outline mb-4'>
                                            <Select
                                            style={{width: '100%'}}
                                            placeholder="Your goal"
                                            onChange={(value) => {setGoal1(value)}}
                                            defaultValue={goal1}
                                            dropdownRender={(menu) => (
                                                <>
                                                {menu}
                                                <Divider
                                                    style={{
                                                    margin: '8px 0',
                                                    }}
                                                />
                                                <Space
                                                    style={{
                                                    padding: '0 8px 4px',
                                                    }}
                                                >
                                                    <Input
                                                    placeholder="Please enter item"
                                                    ref={inputRefGoals}
                                                    value={new_goal}
                                                    onChange={(e) => {setNewGoal(e.target.value)}}
                                                    />
                                                    <Button type="text" onClick={addItemGoal}>
                                                    Add item
                                                    </Button>
                                                </Space>
                                                </>
                                            )}
                                            options={goal_items.map((item) => ({
                                                label: item,
                                                value: item,
                                            }))}
                                            />
                                        </div>
                                        <div className='form-outline mb-4'>
                                            <Select
                                            style={{width: '100%'}}
                                            placeholder="Your goal"
                                            onChange={(value) => {setGoal2(value)}}
                                            defaultValue={goal2}
                                            dropdownRender={(menu) => (
                                                <>
                                                {menu}
                                                <Divider
                                                    style={{
                                                    margin: '8px 0',
                                                    }}
                                                />
                                                <Space
                                                    style={{
                                                    padding: '0 8px 4px',
                                                    }}
                                                >
                                                    <Input
                                                    placeholder="Please enter item"
                                                    ref={inputRefGoals}
                                                    value={new_goal}
                                                    onChange={(e) => {setNewGoal(e.target.value)}}
                                                    />
                                                    <Button type="text" onClick={addItemGoal}>
                                                    Add item
                                                    </Button>
                                                </Space>
                                                </>
                                            )}
                                            options={goal_items.map((item) => ({
                                                label: item,
                                                value: item,
                                            }))}
                                            />
                                        </div>
                                        <div className='form-outline mb-4'>
                                            <Select
                                            style={{width: '100%'}}
                                            placeholder="Your goal"
                                            onChange={(value) => {setGoal3(value)}}
                                            defaultValue={goal3}
                                            dropdownRender={(menu) => (
                                                <>
                                                {menu}
                                                <Divider
                                                    style={{
                                                    margin: '8px 0',
                                                    }}
                                                />
                                                <Space
                                                    style={{
                                                    padding: '0 8px 4px',
                                                    }}
                                                >
                                                    <Input
                                                    placeholder="Please enter item"
                                                    ref={inputRefGoals}
                                                    value={new_goal}
                                                    onChange={(e) => {setNewGoal(e.target.value)}}
                                                    />
                                                    <Button type="text" onClick={addItemGoal}>
                                                    Add item
                                                    </Button>
                                                </Space>
                                                </>
                                            )}
                                            options={goal_items.map((item) => ({
                                                label: item,
                                                value: item,
                                            }))}
                                            />
                                        </div>
                                        <div className='form-outline mb-4'>
                                            <Select
                                            style={{width: '100%'}}
                                            placeholder="Your goal"
                                            onChange={(value) => {setGoal4(value)}}
                                            defaultValue={goal4}
                                            dropdownRender={(menu) => (
                                                <>
                                                {menu}
                                                <Divider
                                                    style={{
                                                    margin: '8px 0',
                                                    }}
                                                />
                                                <Space
                                                    style={{
                                                    padding: '0 8px 4px',
                                                    }}
                                                >
                                                    <Input
                                                    placeholder="Please enter item"
                                                    ref={inputRefGoals}
                                                    value={new_goal}
                                                    onChange={(e) => {setNewGoal(e.target.value)}}
                                                    />
                                                    <Button type="text" onClick={addItemGoal}>
                                                    Add item
                                                    </Button>
                                                </Space>
                                                </>
                                            )}
                                            options={goal_items.map((item) => ({
                                                label: item,
                                                value: item,
                                            }))}
                                            />
                                        </div>
                                    </div>
                                </div>
                                </div>
                                <div className="col-md-6">
                                <div className="card mb-4 mb-md-0">
                                    <div className="card-body">
                                    <p className="mb-4">Hobbies</p>
                                        <div className='form-outline mb-4'>
                                            <Select
                                            style={{width: '100%'}}
                                            placeholder="Your hobby"
                                            onChange={(value) => {setHobbie1(value)}}
                                            defaultValue={hobbie1}
                                            dropdownRender={(menu) => (
                                                <>
                                                {menu}
                                                <Divider
                                                    style={{
                                                    margin: '8px 0',
                                                    }}
                                                />
                                                <Space
                                                    style={{
                                                    padding: '0 8px 4px',
                                                    }}
                                                >
                                                    <Input
                                                    placeholder="Please enter item"
                                                    ref={inputRefHobbies}
                                                    value={new_hobbie}
                                                    onChange={(e) => {setNewHobbie(e.target.value)}}
                                                    />
                                                    <Button type="text" onClick={addItemHobbie}>
                                                    Add item
                                                    </Button>
                                                </Space>
                                                </>
                                            )}
                                            options={hobbie_items.map((item) => ({
                                                label: item,
                                                value: item,
                                            }))}
                                            />
                                        </div>
                                        <div className='form-outline mb-4'>
                                            <Select
                                            style={{width: '100%'}}
                                            placeholder="Your hobby"
                                            onChange={(value) => {setHobbie2(value)}}
                                            defaultValue={hobbie2}
                                            dropdownRender={(menu) => (
                                                <>
                                                {menu}
                                                <Divider
                                                    style={{
                                                    margin: '8px 0',
                                                    }}
                                                />
                                                <Space
                                                    style={{
                                                    padding: '0 8px 4px',
                                                    }}
                                                >
                                                    <Input
                                                    placeholder="Please enter item"
                                                    ref={inputRefHobbies}
                                                    value={new_hobbie}
                                                    onChange={(e) => {setNewHobbie(e.target.value)}}
                                                    />
                                                    <Button type="text" onClick={addItemHobbie}>
                                                    Add item
                                                    </Button>
                                                </Space>
                                                </>
                                            )}
                                            options={hobbie_items.map((item) => ({
                                                label: item,
                                                value: item,
                                            }))}
                                            />
                                        </div>
                                        <div className='form-outline mb-4'>
                                            <Select
                                            style={{width: '100%'}}
                                            placeholder="Your hobby"
                                            onChange={(value) => {setHobbie3(value)}}
                                            defaultValue={hobbie3}
                                            dropdownRender={(menu) => (
                                                <>
                                                {menu}
                                                <Divider
                                                    style={{
                                                    margin: '8px 0',
                                                    }}
                                                />
                                                <Space
                                                    style={{
                                                    padding: '0 8px 4px',
                                                    }}
                                                >
                                                    <Input
                                                    placeholder="Please enter item"
                                                    ref={inputRefHobbies}
                                                    value={new_hobbie}
                                                    onChange={(e) => {setNewHobbie(e.target.value)}}
                                                    />
                                                    <Button type="text" onClick={addItemHobbie}>
                                                    Add item
                                                    </Button>
                                                </Space>
                                                </>
                                            )}
                                            options={hobbie_items.map((item) => ({
                                                label: item,
                                                value: item,
                                            }))}
                                            />
                                        </div>
                                        <div className='form-outline mb-4'>
                                            <Select
                                            style={{width: '100%'}}
                                            placeholder="Your hobby"
                                            onChange={(value) => {setHobbie4(value)}}
                                            defaultValue={hobbie4}
                                            dropdownRender={(menu) => (
                                                <>
                                                {menu}
                                                <Divider
                                                    style={{
                                                    margin: '8px 0',
                                                    }}
                                                />
                                                <Space
                                                    style={{
                                                    padding: '0 8px 4px',
                                                    }}
                                                >
                                                    <Input
                                                    placeholder="Please enter item"
                                                    ref={inputRefHobbies}
                                                    value={new_hobbie}
                                                    onChange={(e) => {setNewHobbie(e.target.value)}}
                                                    />
                                                    <Button type="text" onClick={addItemHobbie}>
                                                    Add item
                                                    </Button>
                                                </Space>
                                                </>
                                            )}
                                            options={hobbie_items.map((item) => ({
                                                label: item,
                                                value: item,
                                            }))}
                                            />
                                        </div>
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

export default Profile;