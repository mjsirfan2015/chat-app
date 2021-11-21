import { BrowserRouter,Route,Switch } from 'react-router-dom';
import './App.scss';
import AuthPage from './AuthPage';
import MainPage from './MainPage';
//import axios from 'axios';
function App() {
  return (
    <div data-theme="default">
      <BrowserRouter>
        <Switch>
          <Route exact path='/'><AuthPage/></Route>
          <Route exact path='/mainPage'><MainPage/></Route>
        </Switch>
      </BrowserRouter>
      
    </div>
    
  );
}

export default App;
