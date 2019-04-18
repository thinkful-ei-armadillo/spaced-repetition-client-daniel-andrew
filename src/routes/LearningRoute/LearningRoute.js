import React, { Component } from "react";
import config from "../../config";
import TokenService from "../../services/token-service";
import { Input, Label } from "../../components/Form/Form";
import Button from "../../components/Button/Button";
import { Link } from 'react-router-dom';
import "./LearningRoute.css";

class LearningRoute extends Component {
  state = {
    nextWord: "",
    wordCorrectCount: 0,
    wordIncorrectCount: 0,
    totalScore: 0,
    answer: "",
    isCorrect: null,
    guess: ""
  };

  handleText = event => {
    const submittedGuess = event.target.value;
    this.setState({
      guess: submittedGuess
    });
  };

  handleSubmit = event => {
    event.preventDefault();

    console.log(this.state);
    fetch(`${config.API_ENDPOINT}/language/guess`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${TokenService.getAuthToken()}`,
        "content-type": "application/json"
      },
      body: JSON.stringify({ 
        guess: this.state.guess 
      })
    })
      .then(res => {
        return res.json();
      })
      .then(res => {
        console.log('total score: ', res.totalScore);

        if (res.answer === this.state.guess) {
          
          this.setState({ 
            isCorrect: true, 
            wordCorrectCount: this.state.wordCorrectCount + 1
           });
        } else {
          this.setState({ 
            isCorrect: false,
            wordIncorrectCount: this.state.wordIncorrectCount + 1
          });
        }

        this.setState({
          answer: res.answer,
          isCorrect: res.isCorrect,
          nextWord: res.nextWord,
          totalScore: res.totalScore,
          wordCorrectCount: res.wordCorrectCount,
          wordIncorrectCount: res.wordIncorrectCount
        })
      });
  };

  handleNext = event => {
    event.preventDefault();

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
          answer: "",
          isCorrect: null,
          guess: "",
          nextWord: res.nextWord,
          totalScore: res.totalScore,
          wordCorrectCount: res.wordCorrectCount,
          wordIncorrectCount: res.wordIncorrectCount
        });
      });
    
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

    let displayScore = (
      <div className="DisplayScore">
        <p>Your total score is: {this.state.totalScore}</p>
      </div>
    );

    let resultTemplate;
    if (this.state.isCorrect === true) {
      resultTemplate = (
        <h2 className="correct-result">You were correct! :D</h2>
      );
    }
    if (this.state.isCorrect === false) {
      resultTemplate = (
        <>
          <h2 className="incorrect-result">Good try, but not quite right :(</h2>
          <p>The correct translation for {this.state.nextWord} was {this.state.answer} and you chose {this.state.guess}!</p>
        </>
      );
    }
    return (
      <section>
        {!this.state.answer ? 
          <h2>Translate the word:</h2> : 
          <div className="DisplayFeedback">
            {this.state.isCorrect ? resultTemplate : resultTemplate}
          </div>}
        <br />
        <span id="learn-word">{this.state.nextWord}</span>
        <br /><br />
        <main>
          {displayScore}
          <br />
          <br />
          <form className="learn-form" onSubmit={e => this.handleSubmit(e)}>
            <Label htmlFor="learn-guess-input">
              What's the translation for this word?
            </Label>
            <br />
            <br />
            <Input
              id="learn-guess-input"
              type="text"
              value={this.state.guess}
              onChange={e => this.handleText(e)}
              required
            />
            <br />
            <br />
            {!this.state.answer ? 
            <Button type="submit" id="learn-submit-button">
              Submit your answer
            </Button> :
            <Link to='learn'>
              <Button id="learn-link-button" onClick={(e) => this.handleNext(e)}>
              Try another word!
              </Button>
            </Link>}
          </form>
          <br />
          <p>
            You have answered this word correctly {this.state.wordCorrectCount}{" "}
            times.
          </p>
          <p>
            You have answered this word incorrectly{" "}
            {this.state.wordIncorrectCount} times.
          </p>
        </main>
      </section>
    );
  }
}

export default LearningRoute;
