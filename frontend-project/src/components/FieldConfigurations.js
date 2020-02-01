import React, { Component } from 'react'
import { Grid, Card, CardContent, Typography, IconButton, Icon, Table, TableHead, TableRow, TableCell, TableBody, InputBase, TextField, Button, Select, MenuItem } from '@material-ui/core';

export class FieldConfigurations extends Component {

  state = {
    adding: false,
    newConfigName: "",
    haveSubConfig: false,
    editingSubConfig: undefined
  }

  componentDidMount () {
    // console.log(this.props.configuringField);
    this.setState({adding: false, newConfigName: "", haveSubConfig: false});
  }

  render() {
    const { configuringField } = this.props;
    const { conf } = configuringField.config;
    // console.log('conf', conf);
    
    return (
      
      
          <Grid item xs={6}>
            <Card>
              <CardContent>
                
                <div className="center-content">
                  {/* <Typography>Field configuration</Typography> */}
                  <Typography>Configurations of field <b>{configuringField.nome}</b></Typography>
                  <IconButton color="primary" className='pull-right' onClick={() => this.setState({adding: true}) } title="New configuration">
                    <Icon fontSize="small">add</Icon>
                  </IconButton>
                </div>

                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Value</TableCell>
                      <TableCell style={{minWidth: '100px'}}></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {conf && Object.keys(conf).map(key => 
                      <TableRow key={key} style={{backgroundColor: this.state.editingSubConfig === key ? 'whitesmoke' : 'white'}}>
                      
                        <TableCell component="th">
                          <InputBase
                            id="standard-name"
                            margin="none"
                            value={key}
                          />
                        </TableCell>
                        
                        <TableCell component="th">
                          {conf[key].temSubConfs ?
                            <Button fullWidth color="primary" onClick={() => { this.props.openSubConfigs(key); this.setState({editingSubConfig: key}) } }>
                              Edit sub-configs
                              <Icon className='right-icon'>keyboard_arrow_right</Icon>
                            </Button>
                          :
                            <TextField
                              fullWidth
                              id="standard-name"
                              margin="none"
                              value={conf[key].valor}
                              onChange={e => this.props.changeFieldConfigValue(this.props.indexConfiguringField, key, e.target.value)}
                            />
                          }
                        </TableCell>
                        
                        <TableCell>
                          <IconButton size='small' aria-label="Remove configuration" className='pull-right' onClick={() => this.props.removeFieldConfig(this.props.indexConfiguringField, key)}>
                            <Icon color="secondary">clear</Icon>
                          </IconButton>
                        </TableCell>

                      </TableRow>
                    )}

                    {this.state.adding &&
                      <TableRow hover>
                        <TableCell component="th">
                          <TextField
                            value={this.state.newConfigName}
                            onChange={e => this.setState({newConfigName: e.target.value})}
                            margin="none"
                          />
                        </TableCell>
                        
                        <TableCell component="th">
                          
                          {/* <TextField
                            value={this.state.newConfigName}
                            onChange={e => this.setState({newConfigName: e.target.value})}
                            margin="none"
                          /> */}

                          <Select fullWidth value={this.state.haveSubConfig} onChange={(e) => this.setState({haveSubConfig: e.target.value})}>
                            <MenuItem value={false}>Without sub-configs</MenuItem>
                            <MenuItem value={true}>With sub-configs</MenuItem>
                          </Select>

                        </TableCell>

                        <TableCell>
                          <IconButton size='small' aria-label="Save default" className='pull-right' onClick={() => {this.props.addNewFieldConfig(this.props.indexConfiguringField, this.state.newConfigName, this.state.haveSubConfig); this.setState({adding: false, newConfigName: "", newConfigValue: ""})}}>
                            <Icon color="primary">done</Icon>
                          </IconButton>
                          <IconButton size='small' aria-label="Remove default" className='pull-right' onClick={() => this.setState({adding: false, newConfigName: "", haveSubConfig: false})}>
                            <Icon color="secondary">clear</Icon>
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    }
                  </TableBody>
                </Table>

              </CardContent>
            </Card>
          </Grid>
        
    )
  }
}

export default FieldConfigurations
