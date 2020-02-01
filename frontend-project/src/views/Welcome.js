import React, { Component } from 'react'
import Header from '../components/Header';
import NewProject from '../components/NewProject';
import { Container, Typography, Grid, Button } from '@material-ui/core';

import { apiSend } from '../haftware/api';
import Projects from '../components/Projects';
import ImportProject from '../components/ImportProject';

export class Welcome extends Component {

  state = {
    projects: undefined,
    action: "create"
  }

  componentDidMount(){
    this.getProjects();
  }

  getProjects(){
    apiSend("getProjects", {}).then(res => {
      this.setState({projects: res});
    });
  }

  changeAction(){
    if (this.state.action === "create"){
      this.setState({action: "import"});
    } else {
      this.setState({action: "create"});
    }
  }

  render() {
    return (
      <div>
        <Header/>

        <Container className='page-container' fixed>
          <Grid container spacing={3}>
            
            <Grid item xs={12}>
              <Typography variant="h6">Welcome to the Haftware Codegen</Typography>
              <Typography>To use the system, you need to select some project, if you don't have one, you can create or import.</Typography>
              <hr/>
            </Grid>
            
            <Grid item xs={7}>
              <Typography variant="h6">Select existing project</Typography>
              <Typography>Select one of the already imported projects below</Typography>
              <br/>
              <Projects reloadProjects={() => this.getProjects()} projects={this.state.projects}></Projects>
            
            </Grid>

            {this.state.action === "create" &&
              <Grid item xs={5}>
                <div className="center-content">
                  <Typography variant="h6">Create new project</Typography>

                  <Button color="primary" className="pull-right" onClick={() => this.changeAction()}>
                    Import project
                  </Button>
                </div>
                {/* <Typography>Você também pode <span onClick={() => console.log("oi")}>importar um projeto existente</span></Typography> */}
                
                <NewProject reloadProjects={() => this.getProjects()}></NewProject>

              </Grid>
            }
            {this.state.action === "import" &&
              <Grid item xs={5}>
                <div className="center-content">
                  <Typography variant="h6">Import existing project</Typography>

                  <Button color="primary" className="pull-right" onClick={() => this.changeAction()}>
                    Create project
                  </Button>
                </div>
                {/* <Typography>Você também pode <span onClick={() => console.log("oi")}>importar um projeto existente</span></Typography> */}
                
                <ImportProject reloadProjects={() => this.getProjects()}></ImportProject>

              </Grid>
            }

          </Grid>
        </Container>

      </div>
    )
  }
}

export default Welcome
