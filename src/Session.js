import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Constants from './Constants.js';
import './Session.css';
import UserVideos from './UserVideos.js';
import Logout from './Logout.js';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

const URL_TEXT = "URL"
const URL_ID = "url"
const LOAD_VIDEO_TEXT = "LOAD VIDEO"

// Takes in a HTTP |response| and throws an error if it's not 200 else returns |response| as is.
function handleFetchErrors(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}

// For now only Youtube videos are supported. Parse the Id of the video. For e.g. for this Youtube
// URL https://www.youtube.com/watch?v=TcAAARgLZ8M the video id will be "TcAAARgLZ8M".
function getYTVideoId(url) {
    var regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    var match = url.match(regExp);
    if (match && match[2].length === 11) {
        return match[2];
    } else {
        return ''
    }
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

// This component is loaded after a user is logged in.
//
// It has an input to load a new video for annotation and also shows the list of vidoes annoatated
// by the user.
class Session extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            // URL of the video to annotate.
            video_url: '',

            // List of videos annotated by the user. This is populated after querying the backend.
            // This is in the form of an array of arrays -
            // [["videoid1", "videotitle1"], ["videoid2", "videotitle2"]...]
            user_videos: [],

            // This is true when |user_videos| are being retrieved by the backend.
            loading_user_videos: true,
        }

        this.updateInput = this.updateInput.bind(this)
        this.handleLoadVideo = this.handleLoadVideo.bind(this)
        this.loadUserVideos = this.loadUserVideos.bind(this)
    }

    // Updates the text input values in this component.
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

    // Once the component is mounted load a user's existing annotated videos.
    componentDidMount() {
        // Initialize user's existing videos from the server.
        // TODO: Is "this" required here.
        this.loadUserVideos()
    }

    // Callback for the |LOAD_VIDEO_TEXT| button.
    handleLoadVideo() {
        console.log('handleLoadVideo url:' + this.state.video_url)
        if (!this.state.video_url || this.state.video_url === '') {
            console.log('Video URL empty')
            return
        }

        this.props.router.navigate(Constants.APP_ROUTE_VIDEO_ANNOTATOR + "/" + getYTVideoId(this.state.video_url))
    }

    // Queries the backend for a user's existing annotated videos.
    loadUserVideos() {
        console.log('loadUserVideos')
        let route_to_fetch = Constants.SERVER + Constants.SERVER_ROUTE_LIST
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
                        // Conver the object into an array as we need to filter it in other
                        // components.
                        user_videos: Object.entries(data.user_videos),
                        loading_user_videos: false
                    }
                )
            })
            .catch(error => {
                console.log("Request error: " + error)
            })
    }

    render() {
        // In the default state this Component shows an -
        // - Input for a video URL and a load button to load it for annotation.
        // - A list of existing annotated user videos.
        //
        // Once the load video button is clicked. We load the video in a |VideoAnnotator| component.
        console.log('In Session render user_videos: ' + this.state.user_videos)

        let user_videos;
        if (this.state.loading_user_videos) {
            user_videos = <p>Loading...</p>
        } else {
            user_videos = <UserVideos user_videos={this.state.user_videos} />
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
                    <Logout />
                </div>
            </div>
        );

    }
}

export default withRouter(Session);