import React, { Component } from 'react'
import { Typography, Grid, Card, CardContent, IconButton, Icon, Table, TableBody, TableRow, TableCell, TableHead, TextField, InputBase } from '@material-ui/core';

export class FieldSubConfigs extends Component {

  state = {
    addingSubConfig: false,
    newSubConfigKey: "",
    newSubConfigValue: "",
  }

  componentDidMount () {
    // console.log(this.props)
  }

  render() {
    const { config, subconfs } = this.props;
    return (
      <Grid item xs={6}>
        <Card>
          <CardContent>
            <div className="center-content">
              <Typography>Sub-configs from <b>{config}</b></Typography>
              <IconButton color="primary" className='pull-right' onClick={() => this.setState({addingSubConfig: true})}>
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
                {subconfs && Object.keys(subconfs).map(key => 
                  
                  <TableRow key={key} hover>
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
                        value={subconfs[key]}
                        margin="none"
                        onChange={e => this.props.changeSubConfigValue(config, key, e.target.value)}
                      />
                    </TableCell>

                    <TableCell>
                      <IconButton size='small' aria-label="Remove default" className='pull-right' onClick={() => null}>
                        <Icon color="secondary">clear</Icon>
                      </IconButton>
                    </TableCell>
                  </TableRow>

                )}

                {this.state.addingSubConfig &&
                  <TableRow hover>
                    <TableCell component="th">
                      <TextField
                        value={this.state.newSubConfigKey}
                        onChange={e => this.setState({newSubConfigKey: e.target.value})}
                        margin="none"
                      />
                    </TableCell>
                    
                    <TableCell component="th">
                      <TextField
                        value={this.state.newSubConfigValue}
                        margin="none"
                        onChange={e => this.setState({newSubConfigValue: e.target.value})}
                      />
                    </TableCell>

                    <TableCell>
                      <IconButton size='small' aria-label="Save sub-config" className='pull-right' onClick={() => { this.props.changeSubConfigValue(config, this.state.newSubConfigKey, this.state.newSubConfigValue); this.setState({addingSubConfig: false, newSubConfigKey: "", newSubConfigValue: ""}) }}>
                        <Icon color="primary">done</Icon>
                      </IconButton>
                      <IconButton size='small' aria-label="Cancel" className='pull-right' onClick={() => this.setState({addingSubConfig: false, newSubConfigKey: "", newSubConfigValue: ""})}>
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

export default FieldSubConfigs
