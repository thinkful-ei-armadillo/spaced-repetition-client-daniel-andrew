import React, { Component } from 'react'
import './dashboard.css';
import config from '../../config';
import TokenService from '../../services/token-service';

class DashboardRoute extends Component {
  state = {
    language: {},
    words: []
  }
  componentDidMount(){
    fetch(`${config.API_ENDPOINT}/language`, {
      method: 'GET',
      headers: {
        "Authorization": `Bearer ${TokenService.getAuthToken()}`,
        "content-type": "application/json"
      }, 
    })
    .then(res => {
      return res.json();
    })
    .then(res => {
      this.setState({ language: res.language, words: res.words })
    })
  }
  render() {
    return (
      <section>
        <h2>My {this.state.language.name} Dashboard</h2>
      </section>
    );
  }
}

export default DashboardRoute
