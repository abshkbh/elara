import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Constants from './Constants.js';
import './Login.css';
import Session from './Session.js';

const USERNAME_TEXT = "Username"
const USERNAME_ID = "username"
const PASSWORD_TEXT = "Password"
const PASSWORD_ID = "password"

function handleFetchErrors(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}

class Login extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            user_email: '',
            user_password: '',
            session_started: false,
        }

        this.updateInput = this.updateInput.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.makeGetCall = this.makeGetCall.bind(this)
    }

    updateInput(e) {
        const value = e.target.value
        const id = e.target.id

        if (id === USERNAME_ID) {
            this.setState({
                user_email: value
            })
        } else if (id === PASSWORD_ID) {
            this.setState({
                user_password: value
            })
        } else {
            console.log("Unrecognized input field")
        }
    }

    makeGetCall() {
        console.log('makeGetCall')
        let route_to_fetch = Constants.Server + "/list"
        console.log('Fetching: ' + route_to_fetch)
        fetch(route_to_fetch,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': 'true',
                },
                credentials: "include",
                mode: "cors",
                withCredentials: true
            }
        ).then(handleFetchErrors)
            .then(response => {
                return response.json()
            }
            )
            .then(data => {
                // TODO: This returns data not found even when it's successful.
                console.log("login data: ", data)
            })
            .catch(error => {
                console.log("Login error: " + error)
            })
    }

    handleSubmit() {
        console.log('handleSubmit')
        let route_to_fetch = Constants.Server + "/login"
        console.log('Fetching: ' + route_to_fetch)
        fetch(route_to_fetch,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': 'true',
                },
                credentials: "include",
                mode: "cors",
                withCredentials: true,
                body: JSON.stringify({ email: this.state.user_email, password: this.state.user_password })
            }
        ).then(handleFetchErrors)
            .then(response => {
                return response.json()
            }
            )
            .then(data => {
                // TODO: This returns data not found even when it's successful.
                console.log("login data: ", data)
                this.makeGetCall()
            })
            .catch(error => {
                console.log("Login error: " + error)
            })
    }

    render() {
        console.log('In Login render')
        if (this.state.session_started) {
            console.log("Session started");
            return <Session email={this.state.user_email} />
        }

        return (
            <div className="parent">
                <h1>Elara</h1>
                <label>{USERNAME_TEXT}</label>
                <TextField id={USERNAME_ID} label={USERNAME_TEXT}
                    variant="outlined"
                    onChange={this.updateInput}
                    value={this.state.player_name} />
                <label>{PASSWORD_TEXT}</label>
                <TextField id={PASSWORD_ID} label={PASSWORD_TEXT} variant="outlined"
                    onChange={this.updateInput} value={this.state.game_password} />
                <div className="submit">
                    <Button variant="contained" onClick={() => this.handleSubmit()}>Login</Button>
                </div>
            </div>
        );
    }
}

export default Login;