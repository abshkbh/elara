import React from 'react';
import YouTube from 'react-youtube';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const ADD_ANNOTATION_TEXT = "ADD ANNOTATION"
const ANNOTATION_ID = "annotation"
const ANNOTATION_TEXT = "annotation"
const SUBMIT_ANNOTATION_TEXT = "SUBMIT ANNOTATION"
const VIDEO_PLAYER_ID = "video-player"

// TODO: Figure out a way to make this part of |state|.
let player = null

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

class VideoAnnotator extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            show_annotation_input: false,
            current_annotation_content: '',
            current_annotation_ts: '',
            player: null,
            annotations: [],
        }
        console.log("URL: " + this.props.url)
        this.handleAddAnnotation = this.handleAddAnnotation.bind(this)
        this.handleSubmitAnnotation = this.handleSubmitAnnotation.bind(this)
        this.updateInput = this.updateInput.bind(this)
        this.getYTVideoURLAtTs = this.getYTVideoURLAtTs.bind(this)
        this.seekVideo = this.seekVideo.bind(this)
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

    handleAddAnnotation() {
        console.log('Current Timestamp: ' + player.getCurrentTime() + 's')
        this.setState({
            current_annotation_ts: player.getCurrentTime(),
            show_annotation_input: true
        })
    }

    handleSubmitAnnotation() {
        let video_player = document.getElementById(VIDEO_PLAYER_ID);
        console.log('Submit Annotation Timestamp: ' + player.getCurrentTime() + " Annotation: " + this.state.current_annotation_content)
        this.setState({
            annotations: this.state.annotations.concat({ "ts": this.state.current_annotation_ts, "content": this.state.current_annotation_content }),
            show_annotation_input: false,
            current_annotation_content: '',
            current_annotation_ts: '',
        })
    }

    getYTVideoURLAtTs(ts) {
        console.log(this.props.url + "&t=" + Math.round(ts) + "s")
        return this.props.url + "&t=" + Math.round(ts) + "s"
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
        const annotations = this.state.annotations.map((annotation) => <li key={annotation.ts.toString()} onClick={() => this.seekVideo(annotation.ts)}>
            <a href="#">{getPrettyTs(annotation.ts)}</a>
            {"- " + annotation.content}
        </li>)

        return (
            <div>
                <div>
                    <YouTube videoId={getYTVideoId(this.props.url)}
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
        console.log('onReady')
        player = event.target
    }
}

export default VideoAnnotator;