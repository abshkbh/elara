import React from 'react';
import YouTube from 'react-youtube';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const ADD_ANNOTATION_TEXT = "ADD ANNOTATION"
const ANNOTATION_ID = "annotation"
const ANNOTATION_TEXT = "annotation"

// For now only Youtube videos are supported. Parse the Id of the video.
function getYTVideoId(url) {
    var regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    var match = url.match(regExp);
    if (match && match[2].length == 11) {
        return match[2];
    } else {
        return ''
    }
}

class VideoAnnotator extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            url: this.props.url,
            show_annotation_input: false,
            current_annotation: '',
        }
        console.log("URL: " + this.state.url)
        this.handleAddAnnotation = this.handleAddAnnotation.bind(this)
        this.updateInput = this.updateInput.bind(this)
    }

    updateInput(e) {
        console.log('updateInput')
        const value = e.target.value
        const id = e.target.id

        if (id === ANNOTATION_ID) {
            this.setState({
                current_annotation: value
            })
        } else {
            console.log("Unrecognized input field")
        }
    }

    handleAddAnnotation() {
        this.setState({
            show_annotation_input: true
        })
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
            annotation_component = <TextField id={ANNOTATION_ID} label={ANNOTATION_TEXT}
                variant="outlined"
                onChange={this.updateInput}
                value={this.state.current_annotation} />
        } else {
            annotation_component = <Button variant="contained" onClick={() => this.handleAddAnnotation()}>{ADD_ANNOTATION_TEXT}</Button>
        }

        return (
            <div>
                <div>
                    <YouTube videoId={getYTVideoId(this.state.url)}
                        opts={opts}
                        onReady={this._onReady}
                    />
                </div>
                <div>
                    {annotation_component}
                </div>
            </div>
        );
    }

    _onReady(event) {
        // access to player in all event handlers via event.target
        //event.target.pauseVideo();
    }
}

export default VideoAnnotator;