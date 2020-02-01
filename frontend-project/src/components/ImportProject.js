import React, { Component } from 'react';
import { Icon, TextField, InputAdornment, IconButton, Button } from '@material-ui/core';
import apiSend from '../haftware/api';

export class ImportProject extends Component {

  state = {
    path: "",
    errorPath: false

  }

  openFileSelector = () => {
    
    apiSend("chooseProjectFileJson", {}).then(res => {
      this.setState({path: res.path});
    });

  }

  importProject = () => {

    this.setState({errorPath: false});
    
    if (this.state.path === ""){
      this.setState({errorPath: true})
      return;
    }

    apiSend("importProject", {caminho: this.state.path}).then(res => {
      this.setState({path: ""});
      this.props.reloadProjects();
    });

  }

  render() {
    return (
      <form noValidate autoComplete="off">
        
      <TextField
        error={this.state.errorPath}
        value={this.state.path}
        id="project-path"
        label="Project path"
        margin="normal"
        fullWidth
        disabled
        helperText="Select the project file (.cgp)"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end" onClick={() => this.openFileSelector()}>
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

      <Button color="primary" className="pull-right" onClick={() => this.importProject()}>
        Confirm
      </Button>

    </form>
    )
  }
}

export default ImportProject
