import React from 'react';

class UserVideos extends React.Component {
    constructor(props) {
        super(props)
        console.log("UV props: " + props)
    }

    render() {
        console.log("UserVideos render urls: " + this.props.user_videos)
        const listItems = this.props.user_videos.map((url) =>
            <li key={url}>
                {url}
            </li >
        )

        return (
            <ul>{listItems}</ul>
        );
    }
}

export default UserVideos;