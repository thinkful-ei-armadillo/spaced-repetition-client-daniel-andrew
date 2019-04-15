import React, { Component } from 'react';
import config from '../../config';
import TokenService from '../../services/token-service';
import { Input, Label } from '../../components/Form/Form';
import Button from '../../components/Button/Button';
import './LearningRoute.css';

class LearningRoute extends Component {
  state = {
    nextWord: '',
    totalScore: 0,
    wordCorrectCount: 0,
    wordIncorrectCount: 0,
    guess: ''
  }

  handleText = (event) => {
    this.setState({
      guess: event.target.value
    })
  }

  handleSubmit = (event) => {
    event.preventDefault();

    console.log(this.state.guess);

    fetch(`${config.API_ENDPOINT}/language/head`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${TokenService.getAuthToken()}`,
        "content-type": "application/json"
      },
      body: {
        guess: this.state.guess
      }
    })
    .then(res => {
      return res.json;
    })
  }

  componentDidMount() {
    fetch(`${config.API_ENDPOINT}/language/head`, {
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
        console.log(res);
        this.setState({ 
          nextWord: res.nextWord,
          totalScore: res.totalScore,
          wordCorrectCount: res.wordCorrectCount,
          wordIncorrectCount: res.wordIncorrectCount
         });
      });
  }


  render() {
    console.log(this.state);
    return (
      <section>
        <h2>Translate the word:</h2><br/>
        <span id='learn-word'>{this.state.nextWord}</span><br/><br/>
        <p>Your total score is: {this.state.totalScore}</p><br/>
        <main>
          <form className='learn-form' onSubmit={(e) => this.handleSubmit(e)}>
            <Label htmlFor='learn-guess-input'>
              What's the translation for this word?
            </Label><br/><br/>
            <Input id='learn-guess-input' type='text' value={this.state.guess} onChange={(e) => this.handleText(e)} required/><br/><br/>
            <Button type='submit' id='learn-submit-button' >Submit your answer</Button>
          </form><br/>
          <p>You have answered this word correctly {this.state.wordCorrectCount} times.</p>
          <p>You have answered this word incorrectly {this.state.wordIncorrectCount} times.</p>
        </main>
      </section>
    );
  }
}

export default LearningRoute
