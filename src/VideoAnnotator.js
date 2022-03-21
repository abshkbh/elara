import React from 'react';
import YouTube from 'react-youtube';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Constants from './Constants.js';
import { useParams } from 'react-router-dom';

const ADD_ANNOTATION_TEXT = "ADD ANNOTATION"
const ANNOTATION_ID = "annotation"
const ANNOTATION_TEXT = "annotation"
const SUBMIT_ANNOTATION_TEXT = "SUBMIT ANNOTATION"
const VIDEO_PLAYER_ID = "video-player"

// TODO: Figure out a way to make this part of |state|.
let player = null

function handleFetchErrors(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}

// |seconds| represents seconds in decimals in a string. For e.g. "2.3456" seconds or "120.12".
// This function returns a string in "hh:mm:ss" (if hours > 0) or "mm:ss".
function getPrettyTs(seconds) {
    let secs = parseFloat(seconds)
    secs = Math.floor(seconds)

    let mins = 0;
    if (secs >= 60) {
        mins = Math.floor(secs / 60)
        secs = secs % 60
    }

    let hours = 0;
    if (mins >= 60) {
        hours = Math.floor(mins / 60)
        mins = hours % 60
    }

    if (hours > 0) {
        return hours.toString() + ":" + mins.toString().padStart(2, '0') + ":" + secs.toString().padStart(2, '0')
    }
    return mins.toString() + ":" + secs.toString().padStart(2, '0')
}

export function withRouter(Children) {
    return (props) => {

        const match = { params: useParams() };
        return <Children {...props} match={match} />
    }
}

class VideoAnnotator extends React.Component {
    constructor(props) {
        super(props)
        // The `video_id` or `email` can come from Session or as a "Link" from UserVideos. Both
        // these cases pass paramateres in a different way.
        let video_id;
        if (typeof this.props.video_id !== 'undefined') {
            video_id = this.props.video_id
        } else {
            video_id = this.props.match.params.video_id
        }

        let email;
        if (typeof this.props.email !== 'undefined') {
            email = this.props.email
        } else {
            email = this.props.match.params.email
        }

        this.state = {
            show_annotation_input: false,
            current_annotation_content: '',
            current_annotation_ts: '',
            player: null,
            // TODO: This is a list of "annotation" objects like {"time_stamp" : "123.45",
            // "content": "Hello"}. The keys for now have to map what the backend has. We should
            // decouple this by using a "map" operator in `loadExistingAnnotations`.
            annotations: [],
            video_title: '',
            video_id: video_id,
            email: email,
        }
        console.log("video_id: " + this.state.video_id)
        console.log("email: " + this.state.email)
        this.handleAddAnnotation = this.handleAddAnnotation.bind(this)
        this.handleSubmitAnnotation = this.handleSubmitAnnotation.bind(this)
        this.updateInput = this.updateInput.bind(this)
        this.seekVideo = this.seekVideo.bind(this)
        this.onReady = this.onReady.bind(this)
        this.loadExistingAnnotations = this.loadExistingAnnotations.bind(this)
    }

    componentDidMount() {
        console.log('componentDidMount')
        this.loadExistingAnnotations()
    }

    updateInput(e) {
        console.log('updateInput')
        const value = e.target.value
        const id = e.target.id

        if (id === ANNOTATION_ID) {
            this.setState({
                current_annotation_content: value
            })
        } else {
            console.log("Unrecognized input field")
        }
    }

    loadExistingAnnotations() {
        console.log('loadExistingAnnotations')
        let route_to_fetch = Constants.Server + "/annotations?video_id=" + this.state.video_id
        console.log('Fetching: ' + route_to_fetch)
        fetch(route_to_fetch,
            {
                method: 'GET',
                headers: {
                    'Access-Control-Allow-Origin': '*',
                },
            }
        ).then(handleFetchErrors)
            .then(response => {
                console.log("loadExistingAnnotations response: ", response)
                return response.json()
            }
            )
            .then(data => {
                console.log("loadExistingAnnotations data: ", data)
                this.setState(
                    {
                        annotations: data.annotations,
                    }
                )
            })
            .catch(error => {
                console.log("Request error: " + error)
            })
    }

    handleAddAnnotation() {
        console.log('Current Timestamp: ' + player.getCurrentTime() + 's')
        this.setState({
            current_annotation_ts: player.getCurrentTime().toString(),
            show_annotation_input: true
        })
    }

    handleSubmitAnnotation() {
        console.log('Submit Annotation Timestamp: ' + player.getCurrentTime() + " Annotation: " + this.state.current_annotation_content)
        let route_to_fetch = Constants.Server + "/add"
        console.log('Putting: ' + route_to_fetch)
        fetch(route_to_fetch,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
                body: JSON.stringify({ video_id: (this.state.video_id), ts: this.state.current_annotation_ts, content: this.state.current_annotation_content, video_title: this.state.video_title }),
            }
        ).then(handleFetchErrors)
            .then(response => {
                console.log("submit annotation response: ", response)
                return response.json()
            }
            )
            .then(data => {
                // TODO: This returns data not found even when it's successful.
                console.log("submit annotation data: ", data)
                this.setState({
                    annotations: this.state.annotations.concat({ "time_stamp": this.state.current_annotation_ts, "content": this.state.current_annotation_content }),
                    show_annotation_input: false,
                    current_annotation_content: '',
                    current_annotation_ts: '',
                })
            })
            .catch(error => {
                console.log("Submit annotation error: " + error)
            })
    }

    seekVideo(ts) {
        console.log('In seekVideo ts: ' + ts)
        player.seekTo(Number.parseFloat(ts), true)
    }

    render() {
        const opts = {
            height: '390',
            width: '640',
            playerVars: {
                // https://developers.google.com/youtube/player_parameters
                autoplay: 1,
            },
        };

        let annotation_component;
        if (this.state.show_annotation_input) {
            annotation_component = <div> <TextField id={ANNOTATION_ID} label={ANNOTATION_TEXT}
                variant="outlined"
                onChange={this.updateInput}
                value={this.state.current_annotation_content} />
                <Button variant="contained" onClick={() => this.handleSubmitAnnotation()}>{SUBMIT_ANNOTATION_TEXT}</Button>
            </div>
        } else {
            annotation_component = <Button variant="contained" onClick={() => this.handleAddAnnotation()}>{ADD_ANNOTATION_TEXT}</Button>
        }

        // TODO: Pull <li> in a separate component.
        const annotations = this.state.annotations.map((annotation) => <li key={annotation.time_stamp.toString()} onClick={() => this.seekVideo(annotation.time_stamp)}>
            <a href="#">{getPrettyTs(annotation.time_stamp)}</a>
            {"- " + annotation.content}
        </li>)

        return (
            <div>
                <div>
                    <YouTube videoId={this.state.video_id}
                        opts={opts}
                        id={VIDEO_PLAYER_ID}
                        onReady={this.onReady}
                    />
                </div>
                <div>
                    {annotation_component}
                </div>
                <div>
                    <ul>{annotations}</ul>
                </div>
            </div>
        );
    }

    onReady(event) {
        // access to player in all event handlers via event.target
        //event.target.pauseVideo();
        console.log('onReady title: ' + event.target.getVideoData().title)
        this.setState(
            {
                video_title: event.target.getVideoData().title
            }
        )
        player = event.target
    }
}

export default withRouter(VideoAnnotator);