import React, { Component } from "react";
import config from "../../config";
import TokenService from "../../services/token-service";
import { Input, Label } from "../../components/Form/Form";
import Button from "../../components/Button/Button";
import { Link } from "react-router-dom";
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
        this.setState({
          answer: res.answer,
          isCorrect: res.isCorrect,
          nextWord: res.nextWord,
          totalScore: res.totalScore,
          wordCorrectCount: res.wordCorrectCount,
          wordIncorrectCount: res.wordIncorrectCount
        });
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
  };

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
        this.setState({
          nextWord: res.nextWord,
          totalScore: res.totalScore,
          wordCorrectCount: res.wordCorrectCount,
          wordIncorrectCount: res.wordIncorrectCount
        });
      });
  }

  render() {
    let displayScore = (
      <div className="DisplayScore">
        <p aria-live="polite">Your total score is: {this.state.totalScore}</p>
      </div>
    );

    let resultTemplate;
    if (this.state.isCorrect === true) {
      resultTemplate = <h2 className="correct-result">You were correct! :D</h2>;
    }
    if (this.state.isCorrect === false) {
      resultTemplate = (
        <>
          <h2 className="incorrect-result">Good try, but not quite right :(</h2>
          <br />
          <p id="feedback-detail">
            The correct answer was <b>{this.state.answer}</b> and you chose{" "}
            <b>{this.state.guess}</b>!
          </p>
        </>
      );
    }
    return (
      <section>
        <main aria-live="polite">
          <div id="question-wrapper">
            <div className="learning-page-title" aria-live="assertive">
              {!this.state.answer ? (
                <h2>Please answer with the data type or missing word:</h2>
              ) : (
                <div className="DisplayFeedback">
                  {this.state.isCorrect ? resultTemplate : resultTemplate}
                </div>
              )}
            </div>
            <br />
            <div aria-live="polite">
              {!this.state.answer ? (
                <span id="learn-word">{this.state.nextWord}</span>
              ) : (
                " "
              )}
            </div>
            <br />
            <br />
            <form className="learn-form" onSubmit={e => this.handleSubmit(e)}>
              {!this.state.answer ? (
                <>
                  <Label htmlFor="learn-guess-input">
                    What is the data type/missing word?
                  </Label>
                  <br />
                  <br />
                  <Input
                    id="learn-guess-input"
                    type="text"
                    value={this.state.guess}
                    onChange={e => this.handleText(e)}
                    required/>
                </> ) : ('')}
              <br />
              <br />
              {!this.state.answer ? (
                <Button type="submit" id="learn-submit-button">
                  Submit your answer
                </Button>
              ) : (
                <Link to="learn">
                  <Button
                    id="learn-link-button"
                    onClick={e => this.handleNext(e)}
                  >
                    Try another word!
                  </Button>
                </Link>
              )}
            </form>
          </div>
          <br />
          <br />
          {displayScore}
          <br />
          <p>
            You have answered this question correctly{" "}
            {this.state.wordCorrectCount} times.
          </p>
          <p>
            You have answered this question incorrectly{" "}
            {this.state.wordIncorrectCount} times.
          </p>
        </main>
      </section>
    );
  }
}

export default LearningRoute;
