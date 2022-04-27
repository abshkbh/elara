import React from 'react';
import { Link } from 'react-router-dom';
import Constants from './Constants';
import DeleteResource from './DeleteResource';

// This component abstracts a list of user videos i.e. their ID and title.
// It renders a list of videos that link to a |VideoAnnotator| containing the video.
class UserVideos extends React.Component {
    constructor(props) {
        super(props)
        console.log("UV props: " + props)
        this.handleDeleteSuccessCb = this.handleDeleteSuccessCb.bind(this)
        this.state = {
            // Copying from props because this can be mutated.
            // List of videos annotated by the user.
            // This is in the form of an array of arrays -
            // [["videoid1", "videotitle1"], ["videoid2", "videotitle2"]...]
            user_videos: this.props.user_videos
        }
    }

    // Called when an annotated video has been successfully deleted. It removes the video from the
    // UI.
    handleDeleteSuccessCb(video_id) {
        console.log("handleDeleteSuccessCb video_id: " + video_id)
        this.setState(
            {
                user_videos: this.state.user_videos.filter(video => video[0] !== video_id)
            }
        )
    }

    render() {
        console.log("UserVideos render urls: " + this.state.user_videos)
        // Return an empty element if no existing videos.
        if (this.state.user_videos.length === 0) {
            console.log("no existing videos")
            return <div></div>
        }

        // Each item in |this.state.user_videos| will be mapped to a |VideoAnnotator| component via
        // a React Router link.
        const listItems = this.state.user_videos.map(([id, title]) => {
            console.log("id=" + id + "title=" + title)
            // TODO: Figure out why "`" is needed for Link to work.
            // TODO: Figure out how to use Constants.APP_ROUTE_VIDEO_ANNOTATOR here.
            return (
                <li key={id}>
                    <Link to={`/annotate/${id}`}>{title}</Link>
                    <DeleteResource resource_type={Constants.resourceType.video} video_id={id} delete_video_success_cb={this.handleDeleteSuccessCb} />
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