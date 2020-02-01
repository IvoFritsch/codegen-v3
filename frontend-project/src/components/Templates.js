import React, { Component } from 'react';
import { Typography, Grid, Card, CardContent, IconButton, Icon, Table, TableBody, TableRow, TableCell, TableHead, TextField, InputBase } from '@material-ui/core';

export class Templates extends Component {

  state = {
    addingTemplate: false,
    newTemplatePath: ""
  }
  
  clearAdittion = () => {
    this.setState({addingTemplate: false, newTemplatePath: ""});
  }

  render() {
    const { templates } = this.props;

    return (
      <Grid item xs={6}>
        <Card>
          <CardContent>
            <div className="center-content">
              <Typography>{this.props.title}</Typography>
              <IconButton color="primary" className='pull-right' onClick={() => this.setState({addingTemplate: true})}>
                <Icon fontSize="small">add</Icon>
              </IconButton>
            </div>

            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Name/path</TableCell>
                  <TableCell style={{maxWidth: '75px'}}></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {templates && templates.map(key => 
                  
                  <TableRow key={key} hover>
                    <TableCell component="th">
                      {key}
                    </TableCell>

                    <TableCell>
                      <div className='pull-right'>
                        <IconButton size='small' aria-label="Edit template" onClick={() => this.props.editFunction(key)}>
                          <Icon color='primary'>edit</Icon>
                        </IconButton>
                        <IconButton size='small' aria-label="Remove template" onClick={() => this.props.removeFunction(key)}>
                          <Icon color="secondary">clear</Icon>
                        </IconButton>
                      </div>
                    </TableCell>
                  </TableRow>

                )}

                {this.state.addingTemplate &&
                  <TableRow hover>
                    <TableCell component="th">
                      <TextField
                        fullWidth
                        value={this.state.newTemplatePath}
                        onChange={e => this.setState({newTemplatePath: e.target.value})}
                        margin="none"
                      />
                    </TableCell>

                    <TableCell>
                      <IconButton size='small' aria-label="Save sub-config" className='pull-right' onClick={() => { this.props.addFunction(this.state.newTemplatePath); this.clearAdittion() }}>
                        <Icon color="primary">done</Icon>
                      </IconButton>
                      <IconButton size='small' aria-label="Cancel" className='pull-right' onClick={this.clearAdittion}>
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

export default Templates
