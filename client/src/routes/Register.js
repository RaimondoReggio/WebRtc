import logo from '../assets/logo/logo.png';
import { Row, Card, Select, Input, Button, Layout, message } from "antd";
import { Content, Header } from "antd/es/layout/layout";
import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


function Register() {
    const [username, setUsername] = useState('');
    const [native_l, setNative_l] = useState('');
    const [new_l, setNew_l] = useState('');

    const { getAccessTokenSilently } = useAuth0();
    const navigate = useNavigate();

    // Create a new user on click on submit buttom 
    const createUser = async() => {
        
        const token = await getAccessTokenSilently();

        await axios({method: 'post', url: 'http://localhost:4000/registerUser', 
            headers: {'Authorization': `Bearer ${token}`}, 
            params : {username: username, native_l: native_l, new_l: new_l } 
        }).then((response) => {
            if(response.data.registered) {
                navigate('/userpage');
            } else {
                alert(response.data.message);
            }
        });
    }

    // Set native language value when the select changes
    const changeNativeL = (value) => {
        setNative_l(value['label']);
    }

    // Set new language value when the select changes
    const changeNewL = (value) => {
        setNew_l(value['label']);
    }

    return (
        <Layout className='home-container'>
            <div className='layout-header'>
                <div className='logo'>
                <img src={logo} alt="logo"/>
                </div>
            </div>
        <Content>
            <Row className="register-container" justify={'center'}>
                <div className="register-content">
                    <div className="title">
                        <h1>Welcome to Talk To Learn</h1>
                    </div>
                    <div className="subtitle">
                        <p className='large'>Few steps to complete your registration</p>
                    </div>
                    <div className="container-card">
                        <Card bordered={false}>
                            <div className="field username-field">
                                <p>Choose your username</p>
                                <Input id="username-input" placeholder="default size" onChange={e => setUsername(e.target.value)} style={{width: 200}}/>
                            </div>
                            <div className="field native-l-field">
                                <p>Select your native language</p>
                                <Select
                                    showSearch
                                    labelInValue
                                    style={{ width: 200 }}
                                    id = "native-l-input"
                                    onChange={changeNativeL}
                                    placeholder="Select your native language"
                                    optionFilterProp="children"
                                    filterOption={(input, option) => (option?.label ?? '').includes(input)}
                                    filterSort={(optionA, optionB) =>
                                        (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                    }
                                    options={[
                                        {
                                            value: '1',
                                            label: 'English',
                                        },
                                        {
                                            value: '2',
                                            label: 'Italian',
                                        },
                                        {
                                            value: '3',
                                            label: 'Spanish',
                                        },
                                        {
                                            value: '4',
                                            label: 'French',
                                        },
                                        {
                                            value: '5',
                                            label: 'Swedish',
                                        },
                                        {
                                            value: '6',
                                            label: 'Chinese',
                                        },
                                    ]}
                                    />
                            </div>
                            <div className="field learn-l-field">
                                <p>Select the language that you want to learn</p>
                                <Select
                                    showSearch
                                    labelInValue
                                    style={{ width: 200 }}
                                    id = "new-l-input"
                                    onChange={changeNewL}
                                    placeholder="Select the language that you want to learn"
                                    optionFilterProp="children"
                                    filterOption={(input, option) => (option?.label ?? '').includes(input)}
                                    filterSort={(optionA, optionB) =>
                                        (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                    }
                                    options={[
                                        {
                                            value: '1',
                                            label: 'English',
                                        },
                                        {
                                            value: '2',
                                            label: 'Italian',
                                        },
                                        {
                                            value: '3',
                                            label: 'Spanish',
                                        },
                                        {
                                            value: '4',
                                            label: 'French',
                                        },
                                        {
                                            value: '5',
                                            label: 'Swedish',
                                        },
                                        {
                                            value: '6',
                                            label: 'Chinese',
                                        },
                                    ]}
                                    />
                            </div>
                            <div className="button-send">
                                <Button type="primary" onClick={() => createUser()} block>Save</Button>
                            </div>
                        </Card>
                    </div>
                </div>
            </Row>
        </Content>
        </Layout>
    );
} 

export default Register