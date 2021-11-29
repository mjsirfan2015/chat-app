import React from 'react';
import { BrowserRouter,Route,Switch } from 'react-router-dom';
import './App.scss';
import AuthPage from './AuthPage';
import MainPage from './MainPage';
//import axios from 'axios';
function App() {
  const [theme, setTheme] = React.useState(localStorage.getItem("chat-app-theme")||"default")
  return (
    <div data-theme={theme}>
      <BrowserRouter>
        <Switch>
          <Route exact path='/'><AuthPage/></Route>
          <Route exact path='/mainPage'><MainPage theme={theme} setTheme={setTheme}/></Route>
        </Switch>
      </BrowserRouter>
      
    </div>
    
  );
}

export default App;
