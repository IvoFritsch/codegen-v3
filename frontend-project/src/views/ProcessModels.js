import React, { Component } from 'react'
import Header from '../components/Header';
import { Container, Grid, Typography, Button, Checkbox, FormControlLabel, FormGroup, FormControl, CircularProgress, Card, CardContent, Icon, Table, TableBody, TableRow, TableCell } from '@material-ui/core';
import apiSend, { getCookie } from '../haftware/api';
import SelectTemplates from '../components/SelectTemplates';
import AdditionalConfigs from '../components/AdditionalConfigs';

export class ProcessModels extends Component {

  state = {
    
    modelsToProcess: undefined,
    templates: undefined,
    configs: [],
    step: 1,
    autoOverwrite: false,
    processing: false,
    processResult: undefined,
    openMessages: undefined,
  }

  componentDidMount ( ) {

    this.setState({ modelsToProcess: this.props.history.location.state.modelsToProcess });
    this.loadData();

  }

  loadData = () => {
    apiSend(`getProject?project=${getCookie("project")}`, {}).then(res => {
      this.setState({templates: res.templates.map(t => ({name: t, checked: true}) )});
      console.log(this.state);
    });
  }

  changeChecked = (index) => {
    const templates = this.state.templates;
    templates[index].checked = !templates[index].checked;
    this.setState({templates});
  }

  checkAllTemplates = () => {
    const templates = this.state.templates;
    for(var t of templates){
      t.checked = true;
    }
    this.setState({templates});
  }
  uncheckAllTemplates = () => {
    const templates = this.state.templates;
    for(var t of templates){
      t.checked = false;
    }
    this.setState({templates});
  }


  processModels = () => {
    let data = {};
    
    data['projeto'] = getCookie('project');

    let modelos = [];
    for(let m of this.state.modelsToProcess){
      modelos.push(m.name);
    }
    data['modelos'] = modelos;

    let templates = [];
    for(let t of this.state.templates){
      templates.push(t.name);
    }
    data['templates'] = templates;

    let configs = [];
    for(let c of this.state.configs){
      configs[c.name] = c.value;
    }
    data['config'] = configs;

    data['autoOverwrite'] = this.state.autoOverwrite;

    // console.log(data);
    this.setState({ processing: true });
    apiSend('processaTemplate', data).then(res => {
      console.log(res);
      this.setState({ processing: false, processResult: res });
     });

  }

  render() {
    return (
      <div>
        <Header/>
        <Container className='page-container' fixed>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant={'h6'}>Process templates</Typography>
              <Typography variant={'subtitle1'}>From this page, you can control the source code generation</Typography>
              <Typography variant={'caption'}>Will be processed the models selected previously</Typography>
              <hr/>
            </Grid>

            {this.state.step === 1 &&
              <SelectTemplates  templates={this.state.templates} 
                                changeChecked={this.changeChecked}
                                checkAll={() => this.checkAllTemplates()}
                                uncheckAll={() => this.uncheckAllTemplates()}
                                continue={() => this.setState({ step: 2 })}/>
            }
            {this.state.step === 2 &&
              <AdditionalConfigs  goBack={() => this.setState({ step: 1 })}
                                  continue={() => this.setState({ step: 3 })}
                                  saveConfig={(c) => this.setState({ configs: c })}/>
            }
            {this.state.step === 3 &&
              <>
                <Grid item xs={3}></Grid>
                <Grid item xs={6}>
                  
                  <div style={{display: this.state.processing ? 'none' : 'unset'}}>
                    <div>  
                      <FormGroup row>
                        <FormControl>
                          <FormControlLabel style={{color: '#3c4858'}}
                            control={
                              <Checkbox value={this.state.autoOverwrite} onChange={() => this.setState({ autoOverwrite: !this.state.autoOverwrite })} />
                            }
                            label="Automatically overwrite conflicting archives (do not open WinMerge)"
                          />
                        </FormControl>
                      </FormGroup>

                    </div>
                    <br/>
                    <Button variant="contained" className='button-orange' fullWidth onClick={() => this.processModels()} >Process</Button>
                  </div>
                  
                  <div style={{textAlign: 'center', display: this.state.processing ? 'block' : 'none'}}>
                    <CircularProgress size={30}/>
                    <br/><br/>
                    <Button variant="contained" className='button-dark-red' fullWidth onClick={() => apiSend('cancelaProcessamento')} >Cancel</Button>
                  </div>

                  <br/><br/>
                  {this.state.processResult &&
                    <Card>
                      <CardContent>
                        {this.state.processResult && Object.keys(this.state.processResult.modelsHasMessages).map( (m, index) => 
                          <div key={index} >
                            <div className={'center-content pointer'} style={{justifyContent: 'unset'}} onClick={() => this.state.openMessages === m ? this.setState({ openMessages: undefined }) : this.setState({ openMessages: m })}>
                              <Icon className={this.state.processResult.modelsHasMessages[m] ? 'color-dark-red' : 'color-sweet-green'}>{this.state.processResult.modelsHasMessages[m] ? 'clear' : 'done'}</Icon>
                              <Typography style={{marginLeft: '8px'}}>{m}</Typography>
                            </div>
                            {this.state.processResult.modelsHasMessages[m] && (this.state.openMessages === m) &&
                              <Table size="small">
                                <TableBody>
                                  {Object.keys(this.state.processResult.mensagens[m]).map( (mm, indexmm) => 
                                    <TableRow key={indexmm}>
                                      <TableCell>
                                      <div className={'center-content'} style={{justifyContent: 'unset'}}>
                                        <Icon className={this.state.processResult.mensagens[m][mm].length > 0 ? 'color-dark-red' : 'color-sweet-green'}>{this.state.processResult.mensagens[m][mm].length > 0 ? 'clear' : 'done'}</Icon>
                                        <Typography style={{marginLeft: '8px'}}>{mm}</Typography>
                                      </div>
                                      {this.state.processResult.mensagens[m][mm].length > 0 &&
                                        <Card>
                                          <CardContent className={'color-dark-red'}>
                                            <div dangerouslySetInnerHTML={{__html: this.state.processResult.mensagens[m][mm][0].replace(/\n/g, '<br/>')}}></div>
                                          </CardContent>
                                        </Card>
                                      }
                                      </TableCell>
                                    </TableRow>
                                  )}
                                </TableBody>
                              </Table>
                            }
                            <hr/>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  }
                </Grid>
                <Grid item xs={3}>
                  <Button variant="contained" className='button-dark-red pull-right' onClick={() => this.setState({ step: 2 })}><Icon>arrow_left</Icon>Back</Button>
                </Grid>
              </>
            }
          </Grid>
        </Container>
              
      </div>
    )
  }
}

export default ProcessModels
