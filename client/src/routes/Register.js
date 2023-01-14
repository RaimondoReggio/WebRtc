import logo from '../assets/logo/logo.png';
import {Select, Input, Button, DatePicker, Steps, Avatar, Divider, Space, message } from "antd";
import TextArea from 'antd/es/input/TextArea';
import React, { useState, useRef, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Axios from 'axios';
import avatar1 from '../assets/avatar/user1.svg';
import avatar2 from '../assets/avatar/user2.svg';
import avatar3 from '../assets/avatar/user3.svg';
import avatar4 from '../assets/avatar/user4.svg';
import avatar5 from '../assets/avatar/user5.svg';
import avatar6 from '../assets/avatar/user6.svg';
import avatar7 from '../assets/avatar/user7.svg';
import avatar8 from '../assets/avatar/user8.svg';
import avatar9 from '../assets/avatar/user9.svg';
import SlickSlider from '../general/carousel';

// Componente utilizzato per effettuare la registrazione dell'utente
// con relativi dati, preferenze, lingue, goal, hobbie

let goal_index = 0;
let hobbie_index = 0;

function Register() {

    const BASE_URL = process.env.REACT_APP_SERVER_URL;
    const [step, setStep] = useState(0);

    const description = 'This is a description.';

    const [slider_index, setSliderIndex] = useState();

    const avatar_array = [avatar1, avatar2, avatar3, avatar4, avatar5, avatar6, avatar7, avatar8, avatar9];

    // Variabili utente
    const [first_name, setFirstName] = useState('');
    const [last_name, setLasttName] = useState('');
    const [username, setUsername] = useState('');
    const [native_l, setNative_l] = useState('');
    const [new_l, setNew_l] = useState('');
    const [gender, setGender] = useState('');
    const [birth_date, setBirthDate] = useState('');
    const [birth_country, setBirthCountry] = useState('');
    const [job, setJob] = useState('');
    const [biography, setBiography] = useState(''); 
    const [avatar_image, setAvatarImage] = useState('https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp');

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


    const [messageApi, contextHolder] = message.useMessage();

    const error = () => {
        messageApi.open({
            type: 'error',
            content: 'Some fields are empty. Fill in all fields please.',
        });
    };
    const { getAccessTokenSilently, user} = useAuth0();

    const navigate = useNavigate();

    // Controlla tramite API se l'utente ha già terminato la registrazione dei dati profilo
    const checkIfUserExist = async() => {
        const token = await getAccessTokenSilently();
        
        await Axios.get(BASE_URL + "/checkIfUserExist", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then((response) => {
            if(response.data.isRegistered) {
                navigate('/userpage');
            }
        })
    }

    useEffect(() => {
        checkIfUserExist();
    })

    // Completa la registrazione dell'utente nel db tramite API
    const createUser = async() => {
        
        const token = await getAccessTokenSilently();

        await axios({method: 'post', url: BASE_URL + '/registerUser', 
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
        }).then((response) => {
            if(response.data.registered) {
                navigate('/userpage');
            } else {
                alert(response.data.message);
            }
        });
    }

    // Gestisce pulsante next
    const handleNext = () => {
        if(step === 0) {
            if(first_name && last_name && username && native_l && new_l && gender && birth_date && birth_country && job && biography) {
                setStep(1);
            } else {
                error();
            }
        }  else if(step === 1) {
            setAvatarImage(avatar_array[slider_index]);
            setStep(2);
        }
    }

    // Gestisce pulsante back
    const handleBack = () => {
        if(step === 1) {
            setStep(0);
        } else if (step === 2) {
            setStep(1);
        }
    }

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
        <div className='register-container' id='register-page'>
            <div className='register-content'>
                <div className='row justify-content-center align-items-center' style={{height: '100%'}}>
                    <div className='col-md-8'>
                        <div className='card-container d-flex justify-content-end'>
                            <div className='card'>
                                <div className='logo-container'>
                                    <img src={logo}/>
                                </div>
                                <div className='card-header'>
                                    <h2>Setting your { step === 0 && 'data'} {step === 1 && 'avatar'} {step === 2 && 'preference'}</h2>
                                </div>
                                <div className='card-body' style={{alignItems: step === 1 && 'center'}}>
                                    <div className='card-body-content' style={{width: step === 1 && '60%'}}>
                                    { step === 0 &&
                                        <>
                                        <div className="row mb-4">
                                            <div className="col">
                                                <div className="form-outline">
                                                    <Input placeholder="First Name" onChange={(e) => {setFirstName(e.target.value)}} />
                                                </div>
                                            </div>
                                            <div className="col">
                                                <div className="form-outline">
                                                    <Input placeholder="Last Name" onChange={(e) => {setLasttName(e.target.value)}}/>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="form-outline mb-4">
                                            <Input placeholder="Username" onChange={(e) => {setUsername(e.target.value)}}/>
                                        </div>

                                        <div className='row mb-4'>
                                            <div className='col'>
                                                <div className="form-outline">
                                                    <Select
                                                        showSearch
                                                        placeholder="Native Language"
                                                        optionFilterProp="children"
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
                                            <div className='col'>
                                                <div className="form-outline ">
                                                    <Select
                                                        showSearch
                                                        placeholder="New Lenguage"
                                                        optionFilterProp="children"
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
                                        </div>
                                        
                                        <div className='row mb-4'>
                                            <div className='col'>
                                                <div className="form-outline">
                                                    <Select
                                                        showSearch
                                                        placeholder="Select your gender"
                                                        optionFilterProp="children"
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
                                                </div>
                                            </div>
                                            <div className='col'>
                                                <div className='form-outline'>
                                                    <DatePicker placeholder="Your birth date" onChange={(date, dateString) => {setBirthDate(dateString)}}/>
                                                </div>
                                            </div>
                                        </div>

                                        <div className='row mb-4'>
                                            <div className='col'>
                                                <div className="form-outline">
                                                    <Select
                                                        showSearch
                                                        placeholder="Select your native country"
                                                        optionFilterProp="children"
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
                                                </div>
                                            </div>
                                            <div className='col'>
                                                <div className='form-outline'>
                                                    <Input placeholder="Your job" onChange={(e) => {setJob(e.target.value)}}/>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="form-outline mb-4">
                                            <TextArea rows={4} placeholder="Write a short description of you" maxLength={50} onChange={(e) => {setBiography(e.target.value)}}/>
                                        </div>
                                        </>
                                    }
                                    {step === 1 && 
                                    <>
                                    <div className='slider-container'>
                                        <div className='slider-content'>
                                            <SlickSlider setActiveSlide={setSliderIndex} dots={false} nav={true}>
                                                <div className='user-avatar-container mb-5 mt-4 d-flex justify-content-center'>
                                                    <Avatar className='user-avatar' size={150}  src={avatar1}/>
                                                </div>
                                                <div className='user-avatar-container mb-5 mt-4 d-flex justify-content-center'>
                                                    <Avatar className='user-avatar' size={150}  src={avatar2}/>
                                                </div>
                                                <div className='user-avatar-container mb-5 mt-4 d-flex justify-content-center'>
                                                    <Avatar className='user-avatar' size={150}  src={avatar3}/>
                                                </div>
                                                <div className='user-avatar-container mb-5 mt-4 d-flex justify-content-center'>
                                                    <Avatar className='user-avatar' size={150}  src={avatar4}/>
                                                </div>
                                                <div className='user-avatar-container mb-5 mt-4 d-flex justify-content-center'>
                                                    <Avatar className='user-avatar' size={150}  src={avatar5}/>
                                                </div>
                                                <div className='user-avatar-container mb-5 mt-4 d-flex justify-content-center'>
                                                    <Avatar className='user-avatar' size={150}  src={avatar6}/>
                                                </div>
                                                <div className='user-avatar-container mb-5 mt-4 d-flex justify-content-center'>
                                                    <Avatar className='user-avatar' size={150}  src={avatar7}/>
                                                </div>
                                                <div className='user-avatar-container mb-5 mt-4 d-flex justify-content-center'>
                                                    <Avatar className='user-avatar' size={150}  src={avatar8}/>
                                                </div>
                                                <div className='user-avatar-container mb-5 mt-4 d-flex justify-content-center'>
                                                    <Avatar className='user-avatar' size={150}  src={avatar9}/>
                                                </div>
                                            </SlickSlider>
                                        </div>
                                    </div>
                                    </>
                                    }
                                    {step === 2 && 
                                    <>
                                    <div className='hobbies-goals-container mt-5'>
                                        <div className='row'>
                                            <p>Tell us more about yourself (optional fields)</p>
                                            <div className='col'>
                                                <div className='text'>
                                                    <p>Choiche your hobbies</p>
                                                </div>
                                                <div className='form-outline mb-4'>
                                                    <Select
                                                    style={{width: '100%'}}
                                                    placeholder="Your hobby"
                                                    onChange={(value) => {setHobbie1(value)}}
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
                                            <div className='col'>
                                                <div className='text'>
                                                    <p>Choiche your goals</p>
                                                </div>
                                                <div className='form-outline mb-4'>
                                                    <Select
                                                    style={{width: '100%'}}
                                                    placeholder="Your goal"
                                                    onChange={(value) => {setGoal1(value)}}
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
                                    </>
                                    }
                                    { step < 2 &&
                                    <>
                                    {contextHolder}
                                    <div className='button-next-container'>
                                        <Button onClick={() => handleNext()}>Next</Button>
                                    </div>
                                    </>
                                    }
                                    { step > 0 &&
                                    <div className='button-back-container'>
                                        <Button onClick={() => handleBack()}>Back</Button>
                                    </div>
                                    }
                                    { step === 2 && 
                                    <div className='button-save-container'>
                                        <Button onClick={() => createUser()}>Save</Button>
                                    </div>
                                    }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='col-md-4' style={{height: '100%'}}>
                        <div className='step-container'>
                            <Steps
                                direction="vertical"
                                current={step}
                                items={[
                                {
                                    title: 'Finished',
                                    description,
                                },
                                {
                                    title: 'In Progress',
                                    description,
                                },
                                {
                                    title: 'Waiting',
                                    description,
                                },
                                ]}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 

export default Register