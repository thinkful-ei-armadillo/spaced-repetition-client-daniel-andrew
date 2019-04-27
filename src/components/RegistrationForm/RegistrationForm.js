import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Input, Required, Label } from '../Form/Form'
import AuthApiService from '../../services/auth-api-service'
import Button from '../Button/Button'
import './RegistrationForm.css'

class RegistrationForm extends Component {
  static defaultProps = {
    onRegistrationSuccess: () => { }
  }

  state = { error: null }

  firstInput = React.createRef()

  handleSubmit = ev => {
    ev.preventDefault()
    const { name, username, password } = ev.target
    AuthApiService.postUser({
      name: name.value,
      username: username.value,
      password: password.value,
    })
      .then(user => {
        name.value = ''
        username.value = ''
        password.value = ''
        this.props.onRegistrationSuccess()
      })
      .then( window.confirm('Account created!') )
      .catch(res => {
        this.setState({ error: res.error })
      })
  }

  componentDidMount() {
    this.firstInput.current.focus()
  }

  renderRegistrationForm() {
    return (
      <form
        onSubmit={this.handleSubmit}
        className='registration-form'
        aria-live='off'
      >
        <div role='alert' aria-live='assertive'>
          {this.state.error && <p>{this.state.error}</p>}
        </div>
        <div>
          <p id='asterisk-notification'>
            All fields marked with an asterisk (*) are required.
          </p><br />
          <Label htmlFor='registration-name-input'>
            Enter your name<Required />
          </Label>
          <br/>
          <Input
            ref={this.firstInput}
            id='registration-name-input'
            name='name'
            required
          />
          <br/>
        </div>
        <div>
          <Label htmlFor='registration-username-input'>
            Choose a username<Required />
          </Label>
          <br/>
          <Input
            id='registration-username-input'
            name='username'
            required
          />
          <br/>
        </div>
        <div>
          <Label htmlFor='registration-password-input'>
            Choose a password<Required />
          </Label>
          <br/>
          <Input
            id='registration-password-input'
            name='password'
            type='password'
            required
          />
          <br/>
        </div>
        <footer>
          <Button type='submit' className='registration-submit'>
            Sign up
          </Button><br/><br/>
          {' '}
          <Link to='/login'>Already have an account?</Link>
        </footer>
      </form>
    )
  }

  render() {
    return (
      this.renderRegistrationForm()
    )
  }
}

export default RegistrationForm
