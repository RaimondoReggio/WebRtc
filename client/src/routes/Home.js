import AuthenticationButton from '../general/auth/authentication-button';
import { Col, Layout, Row } from 'antd';
import logo from '../assets/logo/logo.png';
import image from '../assets/svg/home_img.svg';
import { Content, Header } from 'antd/es/layout/layout';

function Home() {
  return (
    <Layout className='home-container'>
      <Header>
        <div className='logo'>
          <img src={logo} alt="logo"/>
        </div>
      </Header>
      <Content>
        <div className='home-content'>
          <Row className='home-row'>
            <Col className='image-container' span={10}>
                <div className='image'>
                  <img src={image} alt="home-img"/>
                </div>
            </Col>
            <Col className='login-container' span={14}>
              <div className='login-content' justify={'center'} align={'middle'} >
                <div className='title'>
                  <h1>Talk to the World</h1>
                </div>
                <div className='subtitle'>
                  <p>Learn a language for free by chatting with native speakers around the world!</p>
                </div>
                <div className='login-button'>
                  <AuthenticationButton></AuthenticationButton>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </Content>
    </Layout>
  );
}

export default Home;
