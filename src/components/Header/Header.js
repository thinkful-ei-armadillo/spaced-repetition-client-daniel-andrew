import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Button from '../Button/Button'
import TokenService from '../../services/token-service'
import UserContext from '../../contexts/UserContext'
import './Header.css'

class Header extends Component {
  static contextType = UserContext

  handleLogoutClick = () => {
    this.context.processLogout()
  }

  renderLogoutLink() {
    return (
      <div className='logged-in-header'>
        <nav>
        <span className='username-display'>
          {this.context.user.name}
        </span>
          <Link
            onClick={this.handleLogoutClick}
            to='/login'>
            <Button className='logout-button'>
              Logout
            </Button>
          </Link>
        </nav>
      </div>
    )
  }

  renderLoginLink() {
    return (
      <nav className='logged-out-header'>
          <Link to='/login'>
            <Button className='login-button'>
              Login
            </Button>
          </Link>
        {' '}
          <Link to='/register'>
            <Button className='register-button'>
              Sign up
            </Button>
          </Link>
      </nav>
    )
  }

  render() {
    return (
      <header className="Header">
        <h1>
          <Link to='/'>
            learn.js
          </Link>
        </h1>
        {TokenService.hasAuthToken()
          ? this.renderLogoutLink()
          : this.renderLoginLink()}
      </header>
    );
  }
}

export default Header
