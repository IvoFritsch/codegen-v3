import React from 'react';
import './App.css';
import './scss/styles.scss';

import { Router, Switch, Route } from 'react-router';
import history from './history.js';

import Welcome from './views/Welcome';
import EditProject from './views/EditProject';
import EditModel from './views/EditModel';
import ManageProject from './views/ManageProject';
import ProcessModels from './views/ProcessModels';

function App() {
  const routes = [{
    path: '/welcome',
    component: Welcome
  },
  {
    path: '/edit-project',
    component: EditProject
  },
  {
    path: '/edit-model',
    component: EditModel
  },
  {
    path: '/manage-project',
    component: ManageProject
  },
  {
    path: '/process-models',
    component: ProcessModels
  }]

  return (
    <div className="page-background">
      
      <Router history={history}>
        <Switch>
          {routes.map(r => 
            <Route key={r.path} {...r}/>
          )}
          <Route component={Welcome}/>
        </Switch>
      </Router>

    </div>
  );
}

export default App;
