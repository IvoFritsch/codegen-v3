import React, { Component } from 'react'
import Header from '../components/Header';
import { Container, Grid, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Icon, InputAdornment, IconButton } from '@material-ui/core';
import Models from '../components/Models';
import apiSend from '../haftware/api';
import PubSub from 'pubsub-js';

export class EditProject extends Component {

  state = {
    modelName: "",  
    openModalNewModel: false,
    selectedModel: undefined,
    modelSearch: ""
  }

  newModel = (modelName) => {
    // {"nome":"Usuario","listaCampos":[],"config":{"defaults":{}}}
    if (!modelName) {
      this.setState({errorModelName: true});
      return;
    } else {
      this.setState({errorModelName: false});
    }

    apiSend("novoModel", {nome: modelName, listaCampos: [], config: {defaults: {}}}).then(resp => {
      this.setState({openModalNewModel: false, modelName: ""});
      PubSub.publish( 'reload-models' );
    });
  }

  render() {
    return (
      <div>
        <Header/>
        <Container className='page-container' fixed>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <div>
                <div className="center-content">
                  <Typography variant="h6">Select a model to edit</Typography>
                  <div>
                  <TextField
                    value={this.state.modelSearch}
                    placeholder="Type to filter"
                    onChange={e => this.setState({modelSearch: e.target.value.toLowerCase()})}
                    className="margin-right-md"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end" onClick={() => this.setState({modelSearch: ""})}>
                          <IconButton
                            edge="end"
                            aria-label="Toggle password visibility"
                          >
                            <Icon>clear</Icon>
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Button color="primary" aria-label="New model" onClick={() => this.setState({openModalNewModel: true})} style={{float:'right'}}>
                    New model
                    <Icon className='right-icon'>add</Icon>
                  </Button>
                  </div>
                </div>
                
                <hr/>
                
                <Models setModel={(m) => this.setState({selectedModel: m})} filter={this.state.modelSearch}/>
              </div>
              
            </Grid>
          </Grid>
        </Container>


        <Dialog
          open={this.state.openModalNewModel}
          onClose={() => this.setState({openModalNewModel: false, errorModelName: false})}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          
        >
          <DialogTitle id="alert-dialog-title">New model</DialogTitle>
          <DialogContent style={{minWidth: '500px'}}>
          
            <form onSubmit={(e) => {e.preventDefault(); this.newModel(this.state.modelName)}}>
              <TextField
                error={this.state.errorModelName}
                value={this.state.modelName}
                onChange={e => this.setState( {modelName: e.target.value} )}
                id="model-name"
                label="Model name"
                placeholder="Model name"
                margin="normal"
                fullWidth
              />
            </form>

          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.setState({openModalNewModel: false, errorModelName: false})} color="secondary">
              Cancel
            </Button>
            <Button onClick={() => this.newModel(this.state.modelName)} color="primary" autoFocus>
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  }
}

export default EditProject
