
// import './App.css'

import { AppBar, Typography } from "@mui/material"
import { Container, CssBaseline, Toolbar } from '@mui/material';
import { Link, Outlet } from 'react-router-dom';


function App() {


  return (
    <>
      <Container maxWidth="xl">
        <CssBaseline />
        <AppBar position="sticky">
          <Toolbar>
            <Typography variant="h6">
              Personal trainer
            </Typography>
          </Toolbar>
        </AppBar>
        <div className="App">
          <nav >
            <Link to="/">Training</Link>{' '}
            <Link to="/customer">Customers</Link> 
          </nav>
          <Outlet />
        </div>
      </Container>
    </>
  );
}

export default App;

