import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import VideoAnnotator from './VideoAnnotator.js';
import './Session.css';

const URL_TEXT = "URL"
const URL_ID = "url"
const LOAD_VIDEO_TEXT = "LOAD VIDEO"

class Session extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            video_url: '',
            load_video: false,
        }

        this.updateInput = this.updateInput.bind(this)
        this.handleLoadVideo = this.handleLoadVideo.bind(this)
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

    render() {
        console.log('In Session render')
        if (this.state.load_video) {
            console.log("Load Video");
            return <VideoAnnotator />
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
            </div>
        );

    }
}

export default Session;