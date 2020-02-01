import React, { Component } from 'react'
import { Typography, Grid, Card, CardContent, IconButton, Icon, Table, TableBody, TableRow, TableCell, TableHead, TextField, InputBase } from '@material-ui/core';

export class ModelConfigurations extends Component {

  state = {
    addingDefault: false,
    newDefaultKey: "",
    newDefaultValue: "",

    addingModelConfigs: false,
    newModelConfigKey: "",
    newModelConfigValue: ""
  }

  componentDidMount(){
    
  }

  render() {
    const { defaults, modelConfigs } = this.props;
    return (
      <Grid item xs={12}>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Card>
              <CardContent>
                <div className="center-content">
                  <Typography>Default configurations</Typography>
                  <IconButton color="primary" className='pull-right' onClick={() => this.setState({addingDefault: true})}>
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
                    {defaults.map((d, idx) => 
                      
                      <TableRow key={idx} hover>
                        <TableCell component="th">
                          <InputBase
                            id="standard-name"
                            value={d.key}
                            margin="none"
                            onChange={e => this.props.changeDefaultConfigKey(idx, e.target.value)}
                          />
                        </TableCell>
                        
                        <TableCell component="th">
                          <TextField
                            id="standard-name"
                            value={d.value}
                            margin="none"
                            onChange={e => this.props.changeDefaultConfigValue(idx, e.target.value)}
                          />
                        </TableCell>

                        <TableCell>
                          <IconButton size='small' aria-label="Remove default" className='pull-right' onClick={() => this.props.removeDefault(idx)}>
                            <Icon color="secondary">clear</Icon>
                          </IconButton>
                        </TableCell>
                      </TableRow>

                    )}

                    {this.state.addingDefault &&
                      <TableRow hover>
                        <TableCell component="th">
                          <TextField
                            value={this.state.newDefaultKey}
                            onChange={e => this.setState({newDefaultKey: e.target.value})}
                            margin="none"
                          />
                        </TableCell>
                        
                        <TableCell component="th">
                          <TextField
                            value={this.state.newDefaultValue}
                            margin="none"
                            onChange={e => this.setState({newDefaultValue: e.target.value})}
                          />
                        </TableCell>

                        <TableCell>
                          <IconButton size='small' aria-label="Save default" className='pull-right' onClick={() => {this.props.addNewDefault(this.state.newDefaultKey, this.state.newDefaultValue); this.setState({addingDefault: false, newDefaultKey: "", newDefaultValue: ""})}}>
                            <Icon color="primary">done</Icon>
                          </IconButton>
                          <IconButton size='small' aria-label="Remove default" className='pull-right' onClick={() => this.setState({addingDefault: false, newDefaultKey: "", newDefaultValue: ""})}>
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

          <Grid item xs={6}>
            <Card>
              <CardContent>
                <div className="center-content">
                  <Typography>Model configurations</Typography>
                  <IconButton color="primary" className='pull-right'  onClick={() => this.setState({addingModelConfigs: true})}>
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
                    {modelConfigs && Object.keys(modelConfigs).map(key => 
                      
                      <TableRow key={key} hover onClick={() => console.log("editing" + key)}>

                        <TableCell component="th">
                          <InputBase
                            id="standard-name"
                            value={key}
                            margin="none"
                          />
                        </TableCell>
                        
                        <TableCell component="th">
                          <TextField
                            id="standard-name"
                            value={modelConfigs[key]}
                            margin="none"
                            onChange={e => this.props.changeModelConfigValue(key, e.target.value)}
                          />
                        </TableCell>

                        <TableCell>
                          <IconButton size='small' aria-label="Remove model configuration" className='pull-right' onClick={() => this.props.removeModelConfig(key)}>
                            <Icon color="secondary">clear</Icon>
                          </IconButton>
                        </TableCell>
                      </TableRow>

                    )}

                    {this.state.addingModelConfigs &&
                      <TableRow hover>
                        <TableCell component="th">
                          <TextField
                            value={this.state.newModelConfigKey}
                            onChange={e => this.setState({newModelConfigKey: e.target.value})}
                            margin="none"
                          />
                        </TableCell>
                        
                        <TableCell component="th">
                          <TextField
                            value={this.state.newModelConfigValue}
                            margin="none"
                            onChange={e => this.setState({newModelConfigValue: e.target.value})}
                          />
                        </TableCell>

                        <TableCell>
                          <IconButton size='small' aria-label="Save model configuration" className='pull-right' onClick={() => {this.props.addNewModelConfig(this.state.newModelConfigKey, this.state.newModelConfigValue); this.setState({addingModelConfigs: false, newModelConfigKey: "", newModelConfigValue: ""})}}>
                            <Icon color="primary">done</Icon>
                          </IconButton>
                          <IconButton size='small' aria-label="Remove model configuration" className='pull-right' onClick={() => this.setState({addingModelConfigs: false, newModelConfigKey: "", newModelConfigValue: ""})}>
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
        </Grid>

      </Grid>
    )
  }
}

export default ModelConfigurations
