import logo from '../assets/logo/logo.png';
import { Row, Card, Select, Input, Button, Layout } from "antd";
import { Content, Header } from "antd/es/layout/layout";
import React from "react";



function Register() {

    return (
        <Layout className='home-container'>
            <Header>
                <div className='logo'>
                <img src={logo} alt="logo"/>
                </div>
            </Header>
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
                                <Input placeholder="default size" style={{width: 200}}/>
                            </div>
                            <div className="field native-l-field">
                                <p>Select your native language</p>
                                <Select
                                    showSearch
                                    style={{ width: 200 }}
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
                                    style={{ width: 200 }}
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
                                <Button type="primary" block>Save</Button>
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