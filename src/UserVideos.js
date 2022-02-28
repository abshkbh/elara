import React from 'react';
import Constants from './Constants';

class UserVideos extends React.Component {
    constructor(props) {
        super(props)
        console.log("UV props: " + props)
    }

    render() {
        console.log("UserVideos render urls: " + this.props.user_videos)
        const listItems = this.props.user_videos.map((video_id) => {
            const video_url = Constants.YT_WATCH_URL + video_id
            return (
                <li key={video_url}>
                    <a href={video_url}>{video_url}</a>
                </li>
            )
        }
        )

        return (
            <ul> {listItems}</ul >
        );
    }
}

export default UserVideos;