import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import './Login.css';

const USERNAME_TEXT = "Username"
const USERNAME_ID = "username"
const PASSWORD_TEXT = "Password"
const PASSWORD_ID = "password"

class Login extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            user_name: '',
            user_password: '',
        }

        this.updateInput = this.updateInput.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    updateInput(e) {
        const value = e.target.value
        const id = e.target.id

        if (id === USERNAME_ID) {
            this.setState({
                user_name: value
            })
        } else if (id === PASSWORD_ID) {
            this.setState({
                user_password: value
            })
        } else {
            console.log("Unrecognized input field")
        }
    }

    handleSubmit() {
        console.log('handleSubmit')
    }

    render() {
        console.log('In Login render')
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
                    <Button variant="contained" onClick={() => this.handleSubmit}>Submit</Button>
                </div>
            </div>
        );
    }
}

export default Login;