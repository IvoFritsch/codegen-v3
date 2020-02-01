import React, { Component } from 'react'
import apiSend, { getCookie } from '../haftware/api';
import { Paper, Table, TableBody, TableRow, Grid, TableCell, IconButton, Icon, Dialog, DialogTitle, DialogContent, DialogActions, Button, Checkbox, ButtonGroup, Typography } from '@material-ui/core';
import PubSub from 'pubsub-js';
import history from '../history';

export class Models extends Component {

  state = {
    deleteConfirmationModal: undefined,
    models: undefined,
    totalSelected: 0,
  }

  componentDidMount(){
    this.getModels();
    PubSub.subscribe( 'reload-models', () => this.getModels() );
  }

  getModels = () => {
    apiSend(`getModels?project=${getCookie("project")}`, {}).then(resp => {
      // resp.map(m => console.log({name: m, checked: false}));
      this.setState({models: resp.map(m => ({name: m, checked: false}) )});
    });
  }

  deleteModel = (model) => {
    apiSend(`deleteModel?model=${model}`, {}).then(resp => {
      this.setState({deleteConfirmationModal: undefined});
      this.getModels();
    });
  }

  changeChecked = (index) => {
    const models = this.state.models;

    models[index].checked = !models[index].checked;

    this.setState({models});
  }

  checkAll = () => {
    const models = this.state.models;

    for ( let m of models ) m.checked = false;
    
    for ( let m of models.filter(m => m.name.toLowerCase().includes(this.props.filter)) ){
      m.checked = true;
    }

    this.setState({models});
  }

  uncheckAll = () => {
    const models = this.state.models;
    
    for ( let m of models ){
      m.checked = false;
    }

    this.setState({models});
  }

  render() {
    
    console.log(this.state.models);
    return (
      <>
      <Grid container spacing={3}>
      
        <Grid item xs={3}>
          <div className="center-content">
            <ButtonGroup size='small' aria-label="small contained button group">
              <Button className='light-button-teal' onClick={this.checkAll}><Icon>check_box</Icon></Button>
              <Button className='light-button-teal' onClick={this.uncheckAll}><Icon>check_box_outline_blank</Icon></Button>
            </ButtonGroup>
            <Typography className='pull-left'>
              {this.state.models && this.state.models.filter(m => m.checked).length} models selected
            </Typography>
          </div>
        </Grid>
        <Grid item xs={6}></Grid>
        <Grid item xs={3}>
          <Button variant="contained" className='button-teal pull-right'  onClick={() => {
                                                                                    if (this.state.models.filter(m => m.checked).length > 0) {
                                                                                      history.push('/process-models', {modelsToProcess: this.state.models.filter(m => m.checked)});
                                                                                    }
                                                                                  }}>Process templates</Button>
        </Grid>

      
        <Grid item xs={12}>
          <Paper>
            
            <Table size="small">
              <TableBody>
                {this.state.models && this.state.models.filter(m => m.name.toLowerCase().includes(this.props.filter)).map((m, index) =>
                  <TableRow key={index} hover >
                    <TableCell component="th" scope="row" className="center-content">
                      <div>
                        <Checkbox
                          checked={m.checked}
                          onChange={(e) => this.changeChecked(index) }
                          className='color-teal'
                          inputProps={{ 'aria-label': 'primary checkbox' }}
                        />
                        {m.name}
                      </div>
                      <div>
                        <a href={`/edit-model?model=${m.name}`}>
                          <IconButton aria-label="Select model">
                            <Icon color="primary">edit</Icon>
                          </IconButton>
                        </a>
                        <IconButton aria-label="Delete model" onClick={() => this.setState({deleteConfirmationModal: m.name})}>
                          <Icon color="secondary">clear</Icon>
                        </IconButton>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            {this.state.deleteConfirmationModal &&
              <Dialog
                open={!!this.state.deleteConfirmationModal}
                onClose={() => this.setState({deleteConfirmationModal: undefined})}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                
              >
                <DialogTitle id="alert-dialog-title">Delete model</DialogTitle>
                <DialogContent style={{minWidth: '500px'}}>
                  Confirm the deletion of this model ({this.state.deleteConfirmationModal})
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => this.setState({deleteConfirmationModal: undefined})} color="secondary">
                    Cancel
                  </Button>
                  <Button onClick={() => this.deleteModel(this.state.deleteConfirmationModal)} color="primary" autoFocus>
                    Confirm
                  </Button>
                </DialogActions>
              </Dialog>
            }

          </Paper>
        </Grid>
      </Grid>
      </>
    )
  }
}

export default Models
