import React, { Component } from "react";
import "./dashboard.css";
import config from "../../config";
import TokenService from "../../services/token-service";
import Button from '../../components/Button/Button';
import { Link } from 'react-router-dom';

class DashboardRoute extends Component {
  state = {
    language: {},
    words: []
  };
  componentDidMount() {
    fetch(`${config.API_ENDPOINT}/language`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${TokenService.getAuthToken()}`,
        "content-type": "application/json"
      }
    })
      .then(res => {
        return res.json();
      })
      .then(res => {
        this.setState({ language: res.language, words: res.words });
      });
  }
  generateWords = () => {
    return this.state.words.map(word => {
      return (
        <li key={word.id} className='word' aria-live='off'>
          <h4>{word.original}</h4>
          <p>correct answer count: {word.correct_count}</p>
          <p>incorrect answer count: {word.incorrect_count}</p>
          <br />
        </li>
      );
    });
  };
  render() {
    return (
      <section className='dashboard-section' aria-live='off'>
        <h2>My {this.state.language.name} Dashboard</h2>
        <h3>Words to practice</h3>
        <h4>Total correct answers: {this.state.language.total_score}</h4><br />
        <p>The objective of <b>learn.js</b> is to help you learn JavaScript data types<br /> 
        and basic syntax by using the spaced repetition learning method.</p>
        <Link to="/learn" className='mobile-start-button'>
          <Button className='dashboard-start-button'>Start practicing</Button>
        </Link>
        <ul className='words-container'>{this.generateWords()}</ul>
        <Link to="/learn" className='desktop-start-button'>
          <Button className='dashboard-start-button'>Start practicing</Button>
        </Link>
      </section>
    );
  }
}

export default DashboardRoute;
