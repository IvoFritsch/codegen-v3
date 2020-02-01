import React, { Component } from 'react';
import { Grid, Table, TableBody, TableRow, TableCell, Button, Icon, Typography, TableHead, InputBase, TextField, IconButton, Card, CardContent } from '@material-ui/core';

export class AdditionalConfigs extends Component {

  state = {
    configs: [],

    newName: "",
    newValue: "",
    
    adding: false,
  }

  addNewConfig = () => {
    const { configs, newName, newValue } = this.state;

    let config = {name: newName, value: newValue};

    configs.push(config);
    this.setState({ configs, adding: false, newName: '', newValue: '' });
  }

  render() {
    const { configs, newName, newValue, adding } = this.state;
    return (
      <>
        <Grid item xs={8}>
          <Typography variant={'subtitle1'}>Now, define the additional  configurations for the generation</Typography>
          <Typography variant={'subtitle1'}>You can use this configs on templates using <b>${'{root.getConfig(<name>)}'}</b></Typography>
        </Grid>
        
        <Grid item xs={4}>
          <div className='pull-right'>
            {/* <ButtonGroup className='pull-right' size='small' aria-label="small contained button group"> */}
            <Button variant="contained" className='button-dark-red margin-right-sm' style={{width:'calc(50%-10px)'}}  onClick={this.props.goBack}><Icon>arrow_left</Icon>Back</Button>
            <Button variant="contained" className='button-teal' style={{width:'50%'}} onClick={() => {this.props.continue(); this.props.saveConfig(this.state.configs)}}>Continue<Icon>arrow_right</Icon></Button>
            {/* </ButtonGroup> */}
          </div>
        </Grid>
        
        <Grid item xs={6}>
            <Card>
              <CardContent>
                
                <div className="center-content">
                  {/* <Typography>Field configuration</Typography> */}
                  <Typography>Configurations</Typography>
                  <IconButton color="primary" className='pull-right' onClick={() => this.setState({adding: true}) }>
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
                    {configs && configs.map(c => 
                      <TableRow key={c.name}>
                      
                        <TableCell component="th">
                          <InputBase
                            id="standard-name"
                            margin="none"
                            value={c.name}
                          />
                        </TableCell>
                        
                        <TableCell component="th">
                          <InputBase
                            fullWidth
                            id="standard-name"
                            margin="none"
                            value={c.value}
                          />
                        </TableCell>
                        
                        <TableCell>
                          <IconButton size='small' aria-label="Remove configuration" className='pull-right'>
                            <Icon color="secondary">clear</Icon>
                          </IconButton>
                        </TableCell>

                      </TableRow>
                    )}

                    {adding &&
                      <TableRow hover>
                        <TableCell component="th">
                          <TextField
                            value={newName}
                            onChange={e => this.setState({newName: e.target.value})}
                            margin="none"
                          />
                        </TableCell>
                        
                        <TableCell component="th">
                          <TextField
                            id="standard-name"
                            value={newValue}
                            margin="none"
                            onChange={e => this.setState({newValue: e.target.value})}
                          />
                        </TableCell>

                        <TableCell>
                          <IconButton size='small' aria-label="Save default" className='pull-right' onClick={() => this.addNewConfig()}>
                            <Icon color="primary">done</Icon>
                          </IconButton>
                          <IconButton size='small' aria-label="Remove default" className='pull-right' onClick={() => this.setState({ adding: false, newName: '', newValue: '' })} >
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
      </>
    )
  }
}

export default AdditionalConfigs
