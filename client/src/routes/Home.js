import LoginButton from '../partials/auth/login-button';
import logo from '../assets/logo/logo.png';
import image from '../assets/svg/home_img.svg';

function Home() {
  return (
    <div className='home-container'>
      <div className='layout-header'>
        <div className='logo'>
          <img src={logo} alt="logo"/>
        </div>
      </div>
      <div className='main'>
        <div className='home-content'>
          <div className='home-row row'>
            <div className='image-container col-md-4'>
                <div className='image'>
                  <img src={image} alt="home-img"/>
                </div>
            </div>
            <div className='login-container col-md-8'>
              <div className='login-content justify-content-center align-items-center' >
                <div className='title'>
                  <h1>Talk to the World</h1>
                </div>
                <div className='subtitle'>
                  <p>Learn a language for free by chatting with native speakers around the world!</p>
                </div>
                <div className='login-button d-flex justify-content-center'>
                  <LoginButton></LoginButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
