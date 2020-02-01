import React, { Component } from 'react'
import { Icon, TextField, InputAdornment, IconButton, Button } from '@material-ui/core';
import apiSend from '../haftware/api';

export class NewProject extends Component {

  state = {
    name: "",
    errorName: false,

    path: "",
    errorPath: false
  }

  openFolderSelector = () => {
    
    apiSend("chooseNewProjectFolderJson", {}).then(res => {
      this.setState({path: res.path});
    });

  }

  createProject = () => {

    this.setState({errorName: false, errorPath: false});
    
    let error = false;
    if (this.state.name === ""){
      this.setState({errorName: true})
      error = true;
    }
    if (this.state.path === ""){
      this.setState({errorPath: true})
      error = true;
    }

    if (error) return;

    apiSend("createProject", {nome: this.state.name, caminho: this.state.path}).then(res => {
      this.setState({name: "", path: ""});
      this.props.reloadProjects();
    });

  }

  render() {
    return (
      <form noValidate autoComplete="off">
        
        <TextField
          error={this.state.errorName}
          id="project-name"
          label="Project name"
          placeholder="Project name"
          margin="normal"
          onChange={e => this.setState( {name: e.target.value} )}
          value={this.state.name}
          fullWidth
        />

        <TextField
          error={this.state.errorPath}
          id="project-path"
          label="Project path"
          margin="normal"
          fullWidth
          disabled
          helperText="A folder called 'codegenProject' will be created in the directory"
          value={this.state.path}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end" onClick={() => this.openFolderSelector()}>
                <IconButton
                  edge="end"
                  aria-label="Toggle password visibility"
                >
                  <Icon>folder</Icon>
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button color="primary" className="pull-right" onClick={() => this.createProject()}>
          Confirm
        </Button>

      </form>
    )
  }
}

export default NewProject
