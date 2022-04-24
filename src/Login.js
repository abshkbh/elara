import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Constants from './Constants.js';
import './Login.css';
import Session from './Session.js';
import { GoogleLogin } from 'react-google-login';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

const USER_EMAIL_TEXT = "Email"
const USER_EMAIL_ID = "email"
const PASSWORD_TEXT = "Password"
const PASSWORD_ID = "password"
const MIN_USER_EMAIL_LENGTH = 7
const MAX_USER_EMAIL_LENGTH = 50
const MIN_USER_PASSWORD_LENGTH = 8
const MAX_USER_PASSWORD_LENGTH = 35

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

export function withRouter(Component) {
    function ComponentWithRouterProp(props) {
        let location = useLocation();
        let navigate = useNavigate();
        let params = useParams();
        return (
            <Component
                {...props}
                router={{ location, navigate, params }}
            />
        );
    }

    return ComponentWithRouterProp;
}


// This component authenticates a user in our app eithe by username and password or Google OAuth.
class Login extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            user_email: '',
            user_password: '',

            // Input error message. Set when there is a problem in |user_email| or |user_password|.
            error_msg: '',
        }

        this.updateInput = this.updateInput.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleGoogleOauthSuccess = this.handleGoogleOauthSuccess.bind(this)
        this.validateEmail = this.validateEmail.bind(this)
        this.validatePassword = this.validatePassword.bind(this);
    }

    validateEmail() {
        if ((this.state.user_email.length < MIN_USER_EMAIL_LENGTH) || (this.state.user_email.length > MAX_USER_EMAIL_LENGTH)) {
            this.setState(
                {
                    error_msg: 'Invalid email length'
                }
            )
            return false;
        }
        return true;
    }

    validatePassword() {
        if ((this.state.user_password.length < MIN_USER_PASSWORD_LENGTH) || (this.state.user_password.length > MAX_USER_PASSWORD_LENGTH)) {
            this.setState(
                {
                    error_msg: 'Invalid password length'
                }
            )
            return false;
        }

        const regex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$")
        if (!regex.test("^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$", this.state.user_password)) {
            this.setState(
                {
                    error_msg: 'Password should have minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character'
                }
            )
            return false;
        }

        return true;
    }

    // Updates all the text input values.
    updateInput(e) {
        const value = e.target.value
        const id = e.target.id

        if (id === USER_EMAIL_ID) {
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
        let route_to_fetch = Constants.SERVER + Constants.SERVER_ROUTE_GOOGLE_OAUTH_LOGIN
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
                this.props.router.navigate(Constants.APP_ROUTE_SESSION)
            }
            )
            .catch(error => {
                console.log("Google Oauth Login Error: " + error)
            })
    }

    // Called when the username and password are submitted to the backend.
    //
    // This functions sends the username and password to the backend. If the backend is able to
    // successfully login the user, |session_started| is set to True. Else it logs the error.
    handleSubmit() {
        if (!this.validateEmail()) {
            console.log("Invalid Email")
            return;
        }

        if (!this.validatePassword()) {
            console.log("Invalid Password")
            return;
        }

        console.log('handleSubmit')
        let route_to_fetch = Constants.SERVER + Constants.SERVER_ROUTE_PASSWORD_LOGIN
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
                // This means that the user is logged in. Start the session by navigating to it's
                // route.
                console.log("Navigating to Session")
                this.props.router.navigate(Constants.APP_ROUTE_SESSION)
            })
            .catch(error => {
                console.log("Login error: " + error)
            })
    }

    render() {
        console.log('In Login render')
        // If there is an error in one of the input fields. Notify the user via a UI element.
        let input_error;
        if (this.state.error_msg.length > 0) {
            input_error = <p>{this.state.error_msg}</p>
        } else {
            input_error = <div />
        }

        return (
            <div className="parent">
                <h1>Elara</h1>
                <label>{USER_EMAIL_TEXT}</label>
                <TextField id={USER_EMAIL_ID} label={USER_EMAIL_TEXT}
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
                <div>
                    {input_error}
                </div>
            </div>
        );
    }
}

export default withRouter(Login);