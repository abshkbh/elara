import React from 'react';
import Constants from './Constants';

class UserVideos extends React.Component {
    constructor(props) {
        super(props)
        console.log("UV props: " + props)
    }

    render() {
        console.log("UserVideos render urls: " + this.props.user_videos)
        // Return an empty element if no existing videos.
        if (Object.keys(this.props.user_videos).length === 0) {
            console.log("no existing videos")
            return <div></div>
        }

        const listItems = Object.entries(this.props.user_videos).map(([id, title]) => {
            console.log("id=" + id + "title=" + title)
            const video_url = Constants.YT_WATCH_URL + id
            return (
                <li key={video_url}>
                    <a href={video_url}>{title}</a>
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