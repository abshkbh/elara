import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Constants from './Constants.js';
import VideoAnnotator from './VideoAnnotator.js';
import { Navigate } from 'react-router-dom';
import './Session.css';
import UserVideos from './UserVideos.js';

const URL_TEXT = "URL"
const URL_ID = "url"
const LOAD_VIDEO_TEXT = "LOAD VIDEO"
const LOGOUT_TEXT = "Logout"

function handleFetchErrors(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}

// For now only Youtube videos are supported. Parse the Id of the video.
function getYTVideoId(url) {
    var regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    var match = url.match(regExp);
    if (match && match[2].length === 11) {
        return match[2];
    } else {
        return ''
    }
}

class Session extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            video_url: '',
            load_video: false,
            user_videos: [],
            loading_existing_videos_list: true,
            logout: false,
        }

        this.updateInput = this.updateInput.bind(this)
        this.handleLoadVideo = this.handleLoadVideo.bind(this)
        this.loadUserVideos = this.loadUserVideos.bind(this)
        this.handleLogout = this.handleLogout.bind(this)
    }

    updateInput(e) {
        console.log('updateInput')
        const value = e.target.value
        const id = e.target.id

        if (id === URL_ID) {
            this.setState({
                video_url: value
            })
        } else {
            console.log("Unrecognized input field")
        }
    }

    componentDidMount() {
        // Initialize user's existing videos from the server.
        // TODO: Is "this" required here.
        this.loadUserVideos()
    }

    handleLoadVideo() {
        console.log('handleLoadVideo url:' + this.state.video_url)
        if (!this.state.video_url || this.state.video_url === '') {
            console.log('Video URL empty')
            return
        }

        this.setState({
            load_video: true
        })
    }

    loadUserVideos() {
        console.log('loadUserVideos')
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
                console.log("loadUserVideos response: ", response)
                return response.json()
            }
            )
            .then(data => {
                console.log("loadUserVideos data: ", data)
                this.setState(
                    {
                        user_videos: data.user_videos,
                        loading_existing_videos_list: false
                    }
                )
            })
            .catch(error => {
                console.log("Request error: " + error)
            })
    }

    handleLogout() {
        console.log('handleLogout')
        let route_to_fetch = Constants.Server + "/logout"
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
                withCredentials: true
            }
        ).then(handleFetchErrors)
            .then(response => {
                console.log("handleLogout response: ", response)
                return response.json()
            }
            )
            .then(data => {
                console.log("handleLogout data: ", data)
                this.setState(
                    {
                        logout: true
                    }
                )
            })
            .catch(error => {
                console.log("Request error: " + error)
            })
    }

    render() {
        console.log('In Session render user_videos: ' + this.state.user_videos)
        if (this.state.logout) {
            return <Navigate to="/" end />
        }

        if (this.state.load_video) {
            console.log("Load Video")
            return <VideoAnnotator email={this.props.email} video_id={getYTVideoId(this.state.video_url)} />
        }

        let user_videos;
        if (this.state.loading_existing_videos_list) {
            user_videos = <p>Loading...</p>
        } else {
            user_videos = <UserVideos email={this.props.email} user_videos={this.state.user_videos} />
        }

        return (
            <div className="session">
                <div>
                    <label>{URL_TEXT}</label>
                </div>
                <div>
                    <TextField id={URL_ID} label={URL_TEXT}
                        variant="outlined"
                        onChange={this.updateInput}
                        value={this.state.video_url} />
                </div>
                <div>
                    <Button variant="contained" onClick={() => this.handleLoadVideo()}>{LOAD_VIDEO_TEXT}</Button>
                </div>
                <div>
                    {user_videos}
                </div>
                <div>
                    <Button onClick={() => this.handleLogout()}>
                        {LOGOUT_TEXT}
                    </Button>
                </div>
            </div >
        );

    }
}

export default Session;