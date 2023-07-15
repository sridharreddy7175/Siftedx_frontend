import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.css';
import Routes from './routes';
// import './assets/scss/style.scss';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { ToastContainer } from 'react-toastify';
import 'react-calendar/dist/Calendar.css';
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { LinkedInCallback } from "react-linkedin-login-oauth2";
import "react-phone-input-2/lib/bootstrap.css";
import './assets/css/custom.css';
import './assets/css/input.css';
import './assets/css/common.css';
import './assets/css/react-calendar.css';
import './assets/css/style.css';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    const height = `${window.innerHeight}px`;    
    document.documentElement.style.setProperty('--vh', height);
  }, [])
  
  return (
    <Provider store={store}>
      <ToastContainer position="top-center" autoClose={10000} closeButton={true} hideProgressBar={false} theme={'light'} />
      <BrowserRouter basename='/'>
        <Switch>
          <Route exact path="/linkedin" component={LinkedInCallback} />
          <Routes />
        </Switch>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
