import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Constants from './Constants.js';
import './Login.css';
import Session from './Session.js';
import { GoogleLogin } from 'react-google-login';

const USERNAME_TEXT = "Username"
const USERNAME_ID = "username"
const PASSWORD_TEXT = "Password"
const PASSWORD_ID = "password"

// Callback for when Google OAuth fails.
const failureResponseGoogle = (response) => {
    console.log('Google OAuth Failure')
    console.log(response)
}

// Takes in a HTTP |response| and throws an error if it's not 200 else returns |response| as is.
function handleFetchErrors(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}

// This component authenticates a user in our app eithe by username and password or Google OAuth.
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
        this.handleGoogleOauthSuccess = this.handleGoogleOauthSuccess.bind(this)
    }

    // Updates all the text input values.
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

    // Called when Google OAuth succeeds.
    //
    // It sends the token received from |response| to the backend. The backend returns success it's
    // able to verify the token and login the user. In this case |session_started| is set to true.
    // Else we log the error.
    handleGoogleOauthSuccess(response) {
        console.log('OAuth Success')
        console.log(response);
        let route_to_fetch = Constants.Server + "/oauth/google/login"
        console.log('Posting to: ' + route_to_fetch)
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
                body: JSON.stringify({ token: response.tokenId }),
            }
        ).then(handleFetchErrors)
            .then(response => {
                console.log("Google Oauth Login Response: ", response)
                return response.json()
            }
            )
            .then(data => {
                // TODO: This returns data not found even when it's successful.
                console.log("Google Oauth Login Data: ", data)
                this.setState({
                    session_started: true
                })
            }
            )
            .catch(error => {
                console.log("Google Ooauth Login Error: " + error)
            })
    }

    // Called when the username and password are submitted to the backend.
    //
    // This functions sends the username and password to the backend. If the backend is able to
    // successfully login the user, |session_started| is set to True. Else it logs the error.
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
                body: JSON.stringify({ email: this.state.user_email, password: this.state.user_password }),
            }
        ).then(handleFetchErrors)
            .then(response => {
                console.log("login response: ", response)
                return response.json()
            }
            )
            .then(data => {
                // TODO: This returns data not found even when it's successful.
                console.log("login data: ", data)
                this.setState({
                    session_started: true
                })
            })
            .catch(error => {
                console.log("Login error: " + error)
            })
    }

    render() {
        console.log('In Login render')
        // This means that the user is logged in. Start the session.
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
                <div className="oauth">
                    <GoogleLogin
                        clientId="719051941242-1ar5albdc3l4tjplt563f0f405o8h2u3.apps.googleusercontent.com"
                        buttonText="Login With Google"
                        onSuccess={this.handleGoogleOauthSuccess}
                        onFailure={failureResponseGoogle}
                        cookiePolicy={'single_host_origin'}
                    />
                </div>
            </div>
        );
    }
}

export default Login;