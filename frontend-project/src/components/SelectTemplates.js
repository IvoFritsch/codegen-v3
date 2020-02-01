import React, { Component } from 'react'
import { Grid, Paper, Table, TableBody, TableRow, TableCell, Checkbox, ButtonGroup, Button, Icon, Typography } from '@material-ui/core';
import history from '../history';

export class SelectTemplates extends Component {
  render() {
    const { templates } = this.props;
    return (
      <>
        <Grid item xs={12}>
          <Typography variant={'subtitle1'}>Now, select the templates do you want to generate</Typography>
        </Grid>
        <Grid item xs={3}>
          <div className="center-content">
            <ButtonGroup size='small' aria-label="small contained button group">
              <Button className='light-button-teal' onClick={this.props.checkAll}><Icon>check_box</Icon></Button>
              <Button className='light-button-teal' onClick={this.props.uncheckAll}><Icon>check_box_outline_blank</Icon></Button>
            </ButtonGroup>
            <Typography className='pull-left'>
              {templates && templates.filter(t => t.checked).length} templates selected
            </Typography>
          </div>
        </Grid>
        <Grid item xs={6}></Grid>
        <Grid item xs={3}>
          <div className='pull-right'>
            {/* <ButtonGroup className='pull-right' size='small' aria-label="small contained button group"> */}
            <Button variant="contained" className='button-dark-red margin-right-sm' style={{width:'calc(50%-10px)'}} onClick={() => history.push('/edit-project')}><Icon>arrow_left</Icon>Back</Button>
            <Button variant="contained" className='button-teal' style={{width:'50%'}} onClick={this.props.continue}>Continue<Icon>arrow_right</Icon></Button>
            {/* </ButtonGroup> */}
          </div>
        </Grid>
        <Grid item xs={12}>
          <Paper>
            <Table size="small">
              <TableBody>
                {templates && templates.map((t, index) =>
                  <TableRow key={index} hover >
                    <TableCell component="th" scope="row" className="center-content">
                      <div>
                        <Checkbox
                          checked={t.checked}
                          onChange={() => this.props.changeChecked(index) }
                          className='color-teal'
                          inputProps={{ 'aria-label': 'primary checkbox' }}
                        />
                        {t.name}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Paper>
        </Grid>
      </>
    )
  }
}

export default SelectTemplates
