import React, { Component } from 'react'
import { Table, TableCell, TableBody, TableRow, Paper, IconButton, Icon } from '@material-ui/core';
import { apiSend } from '../haftware/api';
import PubSub from 'pubsub-js';
import history from '../history';

export class Projects extends Component {

  setCurrentProject(projectName){
    apiSend(`setProjetoAtual?project=${projectName}`, {}).then(() => {
      PubSub.publish('change-project');
    });
  }

  unlinkProject(projectName){
    apiSend(`unvincProject?project=${projectName}`, {}).then(() => {
      this.props.reloadProjects();
    });
  }

  render() {
    return (
      <Paper>
        <Table size="small">
          <TableBody>
            {this.props.projects && this.props.projects.map((p, index) =>
              <TableRow key={index} hover>
                <TableCell component="th" scope="row" className="center-content">
                  {p.nome}
                  <div>
                    <IconButton
                      aria-label="Select project"
                      onClick={() => { this.setCurrentProject(p.nome); history.push('/edit-project') }}
                    >
                      <Icon color="primary">done</Icon>
                    </IconButton>
                    <IconButton
                      aria-label="Manage project"
                      onClick={() => { this.setCurrentProject(p.nome); history.push('/manage-project') }}
                    >
                      <Icon className='color-teal'>settings</Icon>
                    </IconButton>
                    <IconButton
                      aria-label="Unlink project"
                      onClick={() => this.unlinkProject(p.nome)}
                    >
                      <Icon color="secondary">clear</Icon>
                    </IconButton>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    )
  }
}

export default Projects
