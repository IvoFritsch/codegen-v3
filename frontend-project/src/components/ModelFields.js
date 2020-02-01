import React, { Component } from 'react'
import { Grid, Card, CardContent, Typography, IconButton, Icon, Table, TableHead, TableRow, TableCell, TableBody, TextField, InputBase, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@material-ui/core';
import FieldConfigurations from './FieldConfigurations';
import FieldSubConfigs from './FieldSubConfigs';
import Shortcuts from 'react-easy-shortcuts';

export class ModelFields extends Component {
  state = {
    addingField: false,
    newName: "",
    errorName: false,
    newType: "",
    errorType: false,

    editing: undefined,
    editingName: "",
    editingType: "",

    openModalConfirmation: false,
    fieldToRemove: undefined, 

    configuringField: undefined,
    indexConfiguringField: undefined,

    subConfigsConfig: undefined
  }

  shortcuts = [];
  
  componentDidMount(){
    this.shortcuts.push(Shortcuts.subscribe("ctrl+a", this.newField ));
  }
  componentWillUnmount(){
    Shortcuts.unsubscribe(this.shortcuts);
  }

  verifyName(name){
    if (!name) return false;

    const { fields } = this.props;

    for (var f of fields){
      if (name === f.nome) return false;
    }

    return true;
  }

  addField = (newName, newType) => {

    //verify name
    if (!newName){ this.setState({errorName: true}); return; } else { this.setState({errorName: false}); }

    //verify type
    if (!newType){ this.setState({errorType: true}); return; } else { this.setState({errorType: false}); }

    if ( this.verifyName(newName) ){
      this.props.addField(newName, newType);
      this.setState({addingField: false, newName: "", newType: "", errorName: false, errorType: false});
    } else {
      this.setState({errorName: true});
    }

  }

  confirmEdition = (newName, newType, oldName, oldType) => {

    if ((newName === oldName) && (newType === oldType)){
      this.setState({editing: false});
    }

    //verify name
    if (!newName){ this.setState({errorName: true}); return; } else { this.setState({errorName: false}); }

    //verify type
    if (!newType){ this.setState({errorType: true}); return; } else { this.setState({errorType: false}); }


    if (newName !== oldName){
      if ( !this.verifyName(newName) ){
        this.setState({errorName: true});
        return;
      }
    }

    this.props.confirmEdition(newName, newType, oldName, oldType);
    this.setState({editing: false});

  }

  openSubConfigs = (field) => {
    console.log(field, this.state.configuringField);
    this.setState({subConfigsConfig: field});
  }

  newField = () => {
    this.setState({addingField: true});
    this.setState({editing: false});
  }
  cancelNewField = () => {
    this.setState({addingField: false, newName: "", errorName: false, newType: "", errorType: false});
  }

  render() {
    const { fields } = this.props;
    return (
      <Grid item xs={12} id='model-fields-container'>
          <Card>
            <CardContent>
              <div className="center-content">
                <Typography>Model fields</Typography>
                <IconButton color="primary" className='pull-right' onClick={ this.newField }>
                  <Icon>add</Icon>
                </IconButton>
              </div>

              <Table size="small">

                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Options</TableCell>
                    <TableCell>Move</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {fields && fields.map((f, index) => 
                    <TableRow key={f.nome}>
                      <TableCell>

                        {this.state.editing === f.nome ?
                          <TextField 
                            style={{width:'100%'}}
                            value={this.state.editingName}
                            error={this.state.errorName}
                            onChange={e => this.setState({editingName: e.target.value})}>
                          </TextField>
                          :
                          <InputBase style={{width:'100%'}} className='color-soft-black' disabled value={f.nome}></InputBase>
                        }
                        
                      </TableCell>
                      <TableCell>
                        {this.state.editing === f.nome ?
                          <TextField
                            style={{width:'100%'}}
                            value={this.state.editingType}
                            error={this.state.errorType}
                            onChange={e => this.setState({editingType: e.target.value})}>
                          </TextField>
                          :
                          <InputBase style={{width:'100%'}} className='color-soft-black' disabled value={f.tipoAsString}></InputBase>
                        }
                      </TableCell>
                      
                      {this.state.editing === f.nome ?
                        <TableCell>
                        </TableCell>
                        :
                        <TableCell>
                          <IconButton aria-label="Edit field" onClick={() => this.setState({editing: f.nome, editingName: f.nome, editingType: f.tipoAsString})}>
                            <Icon color='primary' size='small'>edit</Icon>
                          </IconButton>
                          <IconButton aria-label="Config field" onClick={() => { this.setState({configuringField: f, indexConfiguringField: index}); this.setState({subConfigsConfig: undefined}) }}>
                            <Icon className='color-teal' size='small'>settings</Icon>
                          </IconButton>
                          <IconButton aria-label="Remove field" onClick={() => { this.setState({fieldToRemove: index, openModalConfirmation: true}); this.setState({subConfigsConfig: undefined})}}>
                            <Icon color='secondary' size='small'>clear</Icon>
                          </IconButton>
                          <IconButton aria-label="Reply field configurations" className={!!!this.state.configuringField ? 'visible-false' : ''} onClick={() => { this.props.copyFieldConfigs(index, this.state.indexConfiguringField); this.setState({subConfigsConfig: undefined})}}>
                            <Icon className='color-light-blue' size='small'>reply</Icon>
                          </IconButton>
                        </TableCell>
                      }

                      {this.state.editing === f.nome ?
                        <TableCell>
                          <IconButton aria-label="Confirm editing" onClick={() => this.confirmEdition(this.state.editingName, this.state.editingType, f.nome, f.tipoAsString)}>
                            <Icon size='small'>done</Icon>
                          </IconButton>
                          <IconButton aria-label="Cancel editing" onClick={() => this.setState({editing: false})}>
                            <Icon size='small'>clear</Icon>
                          </IconButton>
                        </TableCell>
                        :
                        <TableCell>
                          <IconButton aria-label="Move field up" onClick={() => this.props.moveField(index, index - 1)}>
                            <Icon size='small'>keyboard_arrow_up</Icon>
                          </IconButton>
                          <IconButton aria-label="Move field down" onClick={() => this.props.moveField(index, index + 1)}>
                            <Icon size='small'>keyboard_arrow_down</Icon>
                          </IconButton>
                        </TableCell>
                      }

                    </TableRow>
                  )}

                  {this.state.addingField && 
                    <TableRow>
                      <TableCell>
                        <TextField
                          autoFocus 
                          id='new-field-name'
                          margin="none"
                          error={this.state.errorName}
                          value={this.state.newName}
                          onChange={e => this.setState({newName: e.target.value})}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          margin="none"
                          error={this.state.errorType}
                          value={this.state.newType}
                          onChange={e => this.setState({newType: e.target.value})}
                        />
                      </TableCell>
                      
                      <TableCell></TableCell>

                      <TableCell>
                        <IconButton aria-label="Confirm addition" onClick={() => { this.addField(this.state.newName, this.state.newType) }}>
                          <Icon size='small'>done</Icon>
                        </IconButton>
                        <IconButton aria-label="Cancel addition" onClick={ this.cancelNewField }>
                          <Icon size='small'>clear</Icon>
                        </IconButton>
                      </TableCell>

                    </TableRow>
                  }
                </TableBody>

              </Table>
              
              {!!this.state.configuringField &&
                <Grid item xs={12} style={{padding: '20px 0px 0px 0px'}}>
                  <hr/>
                  <Grid container spacing={3}>
                    
                    <FieldConfigurations  key={this.state.configuringField.nome} configuringField={this.state.configuringField} indexConfiguringField={this.state.indexConfiguringField}
                                          saveFieldConfigurations={(configs, index) => { this.props.saveFieldConfigurations(configs, index); this.setState({configuringField: undefined, indexConfiguringField: undefined}) }}
                                          changeFieldConfigValue={this.props.changeFieldConfigValue}
                                          addNewFieldConfig={this.props.addNewFieldConfig}
                                          removeFieldConfig={this.props.removeFieldConfig}
                                          openSubConfigs={this.openSubConfigs}
                                          closeSubConfigs={() => this.setState({subConfigsConfig: undefined})}/>
                    
                    {!!this.state.subConfigsConfig &&
                      <FieldSubConfigs  config={this.state.subConfigsConfig} subconfs={this.state.configuringField.config.conf[this.state.subConfigsConfig].subconfs}
                                        changeSubConfigValue={(config, subconfig, value) => this.props.changeSubConfigValue(this.state.indexConfiguringField, config, subconfig, value)}/>
                    }
                    </Grid>
          
                  <Button variant="contained" color="primary" className={'pull-right'}
                    onClick={() => { this.props.saveFieldConfigurations(this.state.configuringField, this.state.indexConfiguringField); this.setState({configuringField: undefined, indexConfiguringField: undefined}) }}>
                    Close panel
                  </Button>
                  <br/>
                  <hr style={{marginTop: '2rem'}}/>
                </Grid>
              }

            </CardContent>
          </Card>

        {this.state.fieldToRemove &&
          <Dialog
            open={!!this.state.fieldToRemove}
            onClose={() => this.setState({ fieldToRemove: undefined })}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            
          >
            <DialogTitle id="alert-dialog-title">Confirmation</DialogTitle>
            <DialogContent style={{minWidth: '500px'}}>
              Confirm field remotion ({this.props.fields[this.state.fieldToRemove].nome})
            </DialogContent>
            <DialogActions>
              <Button onClick={() => this.setState({fieldToRemove: undefined})} color="secondary">
                Cancel
              </Button>
              <Button onClick={() => { this.setState({fieldToRemove: undefined}); this.props.removeField(this.state.fieldToRemove) }} color="primary" autoFocus>
                Confirm
              </Button>
            </DialogActions>
          </Dialog>
        }
      </Grid>

      
    )
  }
}

export default ModelFields
