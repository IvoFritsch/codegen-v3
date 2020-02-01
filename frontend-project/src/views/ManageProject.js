import React, { Component } from 'react'
import Header from '../components/Header';
import PubSub from 'pubsub-js';
import { Container, Grid, Typography, TextField, IconButton, Icon } from '@material-ui/core';
import apiSend, { getCookie } from '../haftware/api';
import Templates from '../components/Templates';

export class ManageProject extends Component {

  state = {
    project: undefined,
    oldName: undefined
  }

  componentDidMount(){
    this.loadProject();
  }

  loadProject = () => {
    apiSend(`getProject?project=${getCookie("project")}`).then(resp => {
      this.setState({project: resp, oldName: resp.nome});
    });
  }

  newTemplate = (name) => {
    if(name.trim() === "") return;
    apiSend("addTemplateProjeto", {projeto: this.state.project.nome, nome: name}).then(resp => {
      this.loadProject();
    });
  }
  deleteTemplate  = (name) => {
    apiSend("excluiTemplateProjeto", {projeto: this.state.project.nome, nome: name}).then(resp => {
      this.loadProject();
    });
  }
  editTemplate  = (name) => {
    apiSend("editaTemplateProjeto", {projeto: this.state.project.nome, nome: name}).then(resp => {
    });
  }

  newSnippet = (name) => {
    if(name.trim() === "") return;
    apiSend("addSnippetProjeto", {projeto: this.state.project.nome, nome: name}).then(resp => {
      this.loadProject();
    });
  }
  deleteSnippet  = (name) => {
    apiSend("excluiSnippetProjeto", {projeto: this.state.project.nome, nome: name}).then(resp => {
      this.loadProject();
    });
  }

  editSnippet = (name) => {
    apiSend("editaSnippetProjeto", {projeto: this.state.project.nome, nome: name}).then(resp => {
    });
  }

  renameProject = () => {
    apiSend("renameProject", {newName: this.state.project.nome}).then(resp => {
      this.setState({oldName: this.state.project.nome});
      PubSub.publish('change-project');
    });
  }

  render() {
    return (
      <div>
          <Header/>

          {this.state.project &&
            <Container className='page-container' fixed>
              
                <Grid container spacing={3}>

                  <Grid item xs={12}>
                    <Typography variant="h6">Manage your project</Typography>
                    <Typography>On this page you can create templates and configure your project</Typography>
                    <hr/>
                    <Typography>Project root: {this.state.project.projectRootDir}</Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Grid container>
                        <Grid item xs={11}>
                          <TextField
                            fullWidth
                            value={this.state.project.nome}
                            label="Project name"
                            margin="normal"
                            onChange={(e) => {
                              const proj = this.state.project;
                              proj.nome = e.target.value;
                              this.setState({project: proj});
                            }}
                          ></TextField>
                        </Grid>
                        {(this.state.project.nome !== this.state.oldName) && 
                          <Grid item xs={1} style={{display:'flex', alignItems: 'flex-end', paddingBottom: '8px'}}>
                            <IconButton size='small' aria-label="Save sub-config" onClick={this.renameProject}>
                              <Icon color="primary">done</Icon>
                            </IconButton>
                            <IconButton size='small' aria-label="Cancel" onClick={() => {
                                const proj = this.state.project;
                                proj.nome = this.state.oldName;
                                this.setState({project: proj});
                              }}>
                              <Icon color="secondary">clear</Icon>
                            </IconButton>
                          </Grid>}
                    </Grid>
                  </Grid>

                  <Grid item xs={12} style={{padding: '20px 0px 0px 0px'}}>
                    <hr/>
                    <Grid container spacing={3}>
                      <Templates title={'Project templates'} templates={this.state.project.templates} addFunction={this.newTemplate} removeFunction={this.deleteTemplate} editFunction={this.editTemplate}/>
                      <Templates title={'Project snippets'} templates={this.state.project.snippets} addFunction={this.newSnippet} removeFunction={this.deleteSnippet} editFunction={this.editSnippet}/>
                    </Grid>
                  </Grid>

                </Grid>
            
            </Container>
          }
      </div>
    )
  }
}

export default ManageProject