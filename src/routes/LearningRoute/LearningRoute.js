import React, { Component } from "react";
import config from "../../config";
import TokenService from "../../services/token-service";
import { Input, Label } from "../../components/Form/Form";
import Button from "../../components/Button/Button";
import "./LearningRoute.css";

class LearningRoute extends Component {
  state = {
    nextWord: "",
    answer: '',
    totalScore: 0,
    wordCorrectCount: 0,
    wordIncorrectCount: 0,
    guess: "",
    result: ""
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
      body: JSON.stringify({ guess: this.state.guess })
    })
      .then(res => {
        return res.json();
      })
      .then(res => {
        if (res.answer === "Correct") {
          this.setState({ result: "Correct" });
        } else {
          this.setState({ result: "Incorrect" });
        }
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
        console.log(res);
        this.setState({
          nextWord: res.nextWord,
          answer: res.correctAnswer,
          totalScore: res.totalScore,
          wordCorrectCount: res.wordCorrectCount,
          wordIncorrectCount: res.wordIncorrectCount
        });
      });
  }

  render() {
    console.log(this.state);
    let resultTemplate;
    if (this.state.result === "Correct") {
      resultTemplate = (
        <h2 className="correct-result">Correct!</h2>
      );
    }
    if (this.state.result === "Incorrect") {
      resultTemplate = (
        <>
          <h2 className="incorrect-result">Good try, but not quite right :(</h2>
          <p>The correct translation for {this.state.nextWord} was {this.state.answer} and you chose {this.state.guess}!</p>
        </>
      );
    }
    return (
      <section>
        <h1>Translate the word:</h1>
        <br />
        <span id="learn-word">{this.state.nextWord}</span>
        <br /><br />
        <main>
          <div className="DisplayScore">
            <p>Your total score is: {this.state.totalScore}</p>
          </div>
          <br />
          <br />
          <div className="DisplayFeedback">
            {this.state.result ? resultTemplate : ""}
          </div>
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
            <Button type="submit" id="learn-submit-button">
              Submit your answer
            </Button>
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
