import { createTheme,ThemeProvider } from '@mui/material/styles';
import { purple } from '@mui/material/colors';
import React from 'react';
import { BrowserRouter,Route,Switch } from 'react-router-dom';
import AuthPage from './AuthPage';
import MainPage from './MainPage';
//import axios from 'axios';

const theme = createTheme({
  palette: {
    primary: {
      main:purple[500],
    },
    secondary: {
      main: '#1f1390',
    },
    text:{
      secondary:'white',
    }
  },
  
}
);


function App() {
  return (
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Switch>
            <Route exact path='/'><AuthPage/></Route>
            <Route exact path='/mainPage'><MainPage theme={theme} /></Route>
          </Switch>
        </BrowserRouter>
      </ThemeProvider>
    
  );
}

export default App;
