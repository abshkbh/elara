import React from 'react';
import YouTube from 'react-youtube';

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
        }
        console.log("URL: " + this.state.url)
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

        return <YouTube videoId={getYTVideoId(this.state.url)}
            opts={opts}
            onReady={this._onReady}
        />;
    }

    _onReady(event) {
        // access to player in all event handlers via event.target
        //event.target.pauseVideo();
    }
}

export default VideoAnnotator;