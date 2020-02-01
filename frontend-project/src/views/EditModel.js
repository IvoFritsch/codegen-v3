import React, { Component } from 'react'
import { Container, Grid, Typography, Button, Icon } from '@material-ui/core';
import apiSend, { getURLParameter } from '../haftware/api';
import Header from '../components/Header';
import history from '../history';
import ModelConfigurations from '../components/ModelConfigurations';
import ModelFields from '../components/ModelFields';
import Shortcuts from 'react-easy-shortcuts';

export class EditModel extends Component {

  state = {
    unsaved: false,

    editingModelConfigurations: false,
    selectedModel: undefined,
    model: undefined, 
    sanitizedDefaults: []
  }

  shortcuts = [];
  
  componentDidMount(){

    this.setState({selectedModel: getURLParameter("model")});
    apiSend(`getModel?model=${getURLParameter("model")}`, {}).then(resp => {
      
      const sanitizedDefaults = Object.keys(resp.config.defaults).map(k => ({key: k, value: resp.config.defaults[k]}));
      this.setState({model: resp, sanitizedDefaults});
    });

    this.shortcuts.push(Shortcuts.subscribe("ctrl+s", this.save ));

  }

  componentWillUnmount(){
    Shortcuts.unsubscribe(this.shortcuts);
  }

  handleChanges = () => {
    this.setState({ unsaved: true });
  }

  changeDefaultConfigValue = (idx, value) => {
    const sanitizedDefaults = this.state.sanitizedDefaults;
    sanitizedDefaults[idx].value = value;

    this.setState({sanitizedDefaults});
    this.handleChanges();
  }

  changeDefaultConfigKey = (idx, newKey) => {
    const sanitizedDefaults = this.state.sanitizedDefaults;
    sanitizedDefaults[idx].key = newKey;

    this.setState({sanitizedDefaults});
    this.handleChanges();
  }

  removeDefault = (idx) => {
    const sanitizedDefaults = this.state.sanitizedDefaults;
    sanitizedDefaults.splice(idx, 1);

    this.setState({sanitizedDefaults});
    this.handleChanges();
  }

  addNewDefault = (newKey, newValue) => {
    const sanitizedDefaults = this.state.sanitizedDefaults;
    sanitizedDefaults.push({key: newKey, value: newValue});

    this.setState({sanitizedDefaults});
    this.handleChanges();
  }

  addNewModelConfig = (newKey, newValue) => {
    const model = this.state.model;
    model.config.modelConfigs[newKey] = newValue;
    this.setState({model});
    this.handleChanges();
  }
  removeModelConfig = (key) => {
    const model = this.state.model;
    delete model.config.modelConfigs[key];

    this.setState({model});
    this.handleChanges();
  }
  changeModelConfigValue = (key, value) => {
    const model = this.state.model;
    model.config.modelConfigs[key] = value;

    this.setState({model});
    this.handleChanges();
  }

  addField = (newName, newType) => {
    const model = this.state.model;
    model.listaCampos.push({ nome: newName, tipoAsString: newType, config: {conf: {}} });

    this.setState({model});
    this.handleChanges();
  }

  confirmEdition = (newName, newType, oldName, oldType) => {
    const model = this.state.model;

    for (var f of model.listaCampos){
      if (f.nome === oldName) {
        f.nome = newName;
        f.tipoAsString = newType;
      }
    }

    this.setState({model});
    this.handleChanges();
  }

  save = () => {
    const modeloEnviar = this.state.model;
    modeloEnviar.config.defaults = {};
    this.state.sanitizedDefaults.forEach(d => modeloEnviar.config.defaults[d.key] = d.value);

    apiSend('setModel', modeloEnviar).then(resp => {
      this.setState({unsaved: false});
    });
  }

  removeField = (fieldToRemove) => {
    const model = this.state.model;

    model.listaCampos.splice(fieldToRemove, 1);

    this.setState({model});
    this.handleChanges();
  }

  moveField = (currentIndex, newIndex) => {
    if (newIndex < 0) return;
    if (newIndex > this.state.model.listaCampos.length - 1) return;
    const model = this.state.model;
    
    var aux = model.listaCampos[newIndex];
    model.listaCampos[newIndex] = model.listaCampos[currentIndex];
    model.listaCampos[currentIndex] = aux;

    this.setState({model});
    this.handleChanges();
  }

  saveFieldConfigurations = (fieldConfigurations, index) => {
    const model = this.state.model;

    model.listaCampos[index] = fieldConfigurations;

    this.setState({model});
    this.handleChanges();
  }

  addNewFieldConfig = (fieldIndex, fieldName, haveSubConfig) => {
    const model = this.state.model;

    if (haveSubConfig){
      model.listaCampos[fieldIndex].config.conf[fieldName] = {subconfs: {}, nome: fieldName, temSubConfs: haveSubConfig};
    } else {
      model.listaCampos[fieldIndex].config.conf[fieldName] = {nome: fieldName, valor: '', temSubConfs: haveSubConfig};
    }

    this.setState({model});
    this.handleChanges();
  }

  removeFieldConfig = (fieldIndex, configKey) => {
    const model = this.state.model;

    delete model.listaCampos[fieldIndex].config.conf[configKey];

    this.setState({model});
    this.handleChanges();
  }

  changeFieldConfigValue = (fieldIndex, key, value) => {
    const model = this.state.model;

    model.listaCampos[fieldIndex].config.conf[key].valor = value;

    this.setState({model});
    this.handleChanges();
  }

  copyFieldConfigs = (originFieldIndex, destinyFieldIndex) => {
    const model = this.state.model;
    
    model.listaCampos[destinyFieldIndex].config.conf = JSON.parse(JSON.stringify(model.listaCampos[originFieldIndex].config.conf));

    this.setState({model});
    this.handleChanges();
  }

  changeSubConfigValue = (field, config, subconfig, value) => {
    // console.log(field, config, subconfig, value)
    const model = this.state.model;
    
    model.listaCampos[field].config.conf[config].subconfs[subconfig] = value;

    this.setState({model});
    this.handleChanges();
  }

  render() {
    return (
      <div>
        <Header/>
        <Container className='page-container' fixed>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <div className="center-content">
                <div>
                  <Typography variant="h6">Editing model <span className={this.state.unsaved ? 'color-dark-red' : 'color-black-text'}>{this.state.selectedModel}</span></Typography>
                  <Typography>Here you can create fields and edit their configurations, besides edit the model configurations.</Typography>
                </div>
                <Button color="primary" onClick={() => history.push('/edit-project')}>Change model</Button>
              </div>
              <hr/>
              <Button variant="contained" className='pull-left button-orange' onClick={() => this.setState({editingModelConfigurations: !this.state.editingModelConfigurations})}>
                <Icon fontSize="small" className='left-icon'>settings</Icon>
                Model configurations
                <Icon className='right-icon'>{this.state.editingModelConfigurations ? 'arrow_drop_up' : 'arrow_drop_down'}</Icon>
              </Button>

              <div style={{display: 'inline-grid', float: 'right'}}>
                <Button variant="contained" color="primary" className={'pull-right ' + (this.state.unsaved ? 'button-dark-red' : 'button-teal')} onClick={() => this.save()}>
                  Save
                  <Icon fontSize="small" className='right-icon'>save</Icon>
                </Button>
                {this.state.unsaved ?
                  <Typography variant="caption" className='color-dark-red align-right'>
                    unsaved
                  </Typography>
                :  
                  <Typography variant="caption" className='color-teal align-right'>
                    saved
                  </Typography>
                }
              </div>
            </Grid>

            {this.state.editingModelConfigurations &&
              <ModelConfigurations  addNewDefault={(newKey, newValue) => this.addNewDefault(newKey, newValue)}
                                    removeDefault={(key) => this.removeDefault(key)}
                                    changeDefaultConfigValue={(idx, value) => this.changeDefaultConfigValue(idx, value)}
                                    changeDefaultConfigKey={(idx, key) => this.changeDefaultConfigKey(idx, key)}
                                    
                                    addNewModelConfig={(newKey, newValue) => this.addNewModelConfig(newKey, newValue)}
                                    removeModelConfig={(key) => this.removeModelConfig(key)}
                                    changeModelConfigValue={(key, value) => this.changeModelConfigValue(key, value)}
                                    
                                    defaults={this.state.sanitizedDefaults}
                                    modelConfigs={this.state.model.config.modelConfigs}/>
            }
            
            {this.state.model &&
              <ModelFields  fields={ this.state.model.listaCampos }
                            addField={ this.addField }
                            confirmEdition={ this.confirmEdition }
                            removeField={ this.removeField }
                            moveField={ this.moveField }
                            saveFieldConfigurations={ this.saveFieldConfigurations }
                            changeFieldConfigValue={ this.changeFieldConfigValue }
                            addNewFieldConfig={this.addNewFieldConfig}
                            removeFieldConfig={this.removeFieldConfig}
                            copyFieldConfigs={this.copyFieldConfigs}
                            changeSubConfigValue={this.changeSubConfigValue}/>
            }

          </Grid>
        </Container>
      
      </div>

    )
  }
}

export default EditModel
