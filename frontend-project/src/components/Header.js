import React, { Component } from 'react'
import { AppBar, Toolbar, Typography, IconButton, MenuItem, Icon, Popover, Grid, Container, Button } from '@material-ui/core'

import { getCookie } from '../haftware/api';
import PubSub from 'pubsub-js';
import history from '../history';

export class Header extends Component {

  state = {
    currentProject: undefined
  }


  componentDidMount(){
    this.getCurrentProject();
    PubSub.subscribe( 'change-project', () => this.getCurrentProject() );
  }

  menuDropDown = () => {
    const [anchorEl, setAnchorEl] = React.useState(null);
  
    function handleClick(event) {
      setAnchorEl(event.currentTarget);
    }
  
    function handleClose() {
      setAnchorEl(null);
    }
  
    const open = Boolean(anchorEl);    

    return (
      <div className='pull-left'>
        <IconButton edge="start" color="inherit" aria-label="Menu" className='margin-right-md' aria-describedby={`popover`} onClick={handleClick}>
          <Icon>menu</Icon>
        </IconButton>
        <Popover
          id={`popover`}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          <MenuItem onClick={() => { history.push("/welcome") }}>Change project</MenuItem>
          <MenuItem onClick={() => { history.push("/edit-project") }}>Edit current project</MenuItem>
        </Popover>
      </div>
    );
  }

  getCurrentProject = () => {
    this.setState({currentProject: getCookie("project")})
  }

  render() {
    return (
      <AppBar position="static">
        <Container fixed>
          
          <Toolbar>
            <this.menuDropDown />
            
            <Grid item xs={6}>
              <Typography variant="h6">
                <Button size="large" className='color-white' onClick={() => history.push('/welcome')}>
                  Haftware Codegen
                </Button>
              </Typography>
            </Grid>
            
            <Grid
              container
              direction="row"
              justify="flex-end"
              alignItems="center"
            >
              <Typography variant="subtitle1"><span style={{opacity: '0.5'}}>Current project: </span>{this.state.currentProject}</Typography>
            </Grid>

          </Toolbar>

        </Container>
      </AppBar>
    )
  }
}

export default Header
