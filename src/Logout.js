import React from 'react';
import Button from '@material-ui/core/Button';
import Constants from './Constants.js';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

const LOGOUT_BUTTON_TEXT = "Logout"

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

// This component implements the Logout mechanism.
class Logout extends React.Component {
    constructor(props) {
        super(props)
        this.handleLogout = this.handleLogout.bind(this)
    }

    // Handles the logout button click by sending a request to the backend.
    handleLogout() {
        console.log('handleLogout')
        let route_to_fetch = Constants.SERVER + Constants.SERVER_ROUTE_LOGOUT
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
            }
        ).then(handleFetchErrors)
            .then(response => {
                console.log("Logout Response: ", response)
                return response.json()
            }
            )
            .then(data => {
                // TODO: This returns data not found even when it's successful.
                console.log("Logout Data: ", data)
                this.props.router.navigate(Constants.APP_ROUTE_LOGIN)
            }
            )
            .catch(error => {
                console.log("Logout Error: " + error)
            })

    }

    render() {
        return (
            <div className="logout">
                <div className="logout-button">
                    <Button variant="contained" onClick={() => this.handleLogout()}>{LOGOUT_BUTTON_TEXT}</Button>
                </div>
            </div>
        );
    }
}

export default withRouter(Logout);