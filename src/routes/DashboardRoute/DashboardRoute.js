import React, { Component } from 'react'
import './dashboard.css';
import config from '../../config';
import TokenService from '../../services/token-service';

class DashboardRoute extends Component {
  state = {
    languageName: '',
  }
  // getLanguage = () => {
  //   fetch(`${config.API_ENDPOINT}/language`, {
  //     method: 'GET',
  //     header: {
  //       "content-type": "application/json"
  //     } 
  //   })
  //   .then(res => {
  //     console.log(res);
  //     return res.json();
  //   })
  //   .then(res => {
  //     this.setState({ languageName: res.name })
  //   })
  // }
  componentDidMount(){
    console.log(TokenService.getAuthToken())
    fetch(`${config.API_ENDPOINT}/language`, {
      method: 'GET',
      header: {
        "Authorization": `Bearer ${TokenService.getAuthToken()}`,
        "content-type": "application/json"
      }, 
    })
    .then(res => {
      console.log(res);
      return res.json();
    })
    .then(res => {
      this.setState({ languageName: res.name })
    })
  }
  render() {
    // this.getLanguage();
    // let language = this.state.languageName;
    return (
      <section>
        <h2>My {this.state.languageName} Dashboard</h2>
      </section>
    );
  }
}

export default DashboardRoute
