import React from 'react';
import Button from '@material-ui/core/Button';
import Constants from './Constants';

const DELETE_BUTTON_TEXT = "Delete"

// Takes in a HTTP |response| and throws an error if it's not 200 else returns |response| as is.
function handleFetchErrors(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}

// This component lets the user delete a video or annotation in the server.
class DeleteResource extends React.Component {
    constructor(props) {
        super(props)
        this.handleDelete = this.handleDelete.bind(this)
    }

    handleDelete() {
        let route_to_fetch = Constants.SERVER
        let body = {}
        if (this.props.resource_type === Constants.resourceType.video) {
            if (this.props.video_id === undefined) {
                console.log("video id not defined")
                return
            }

            route_to_fetch += Constants.SERVER_ROUTE_DELETE_VIDEO
            body = { "video_id": this.props.video_id }
        } else if (this.props.resource_type === Constants.resourceType.annotation) {
            if (this.props.annotation_ts === undefined) {
                console.log("annotation time stamp not defined")
                return
            }

            route_to_fetch += Constants.SERVER_ROUTE_DELETE_ANNOTATION
            body = { "video_id": this.props.video_id, "annotation_ts": this.props.annotation_ts }
        } else {
            console.log("Bad resource type: " + this.props.resourceType)
            return
        }

        console.log("handleDelete route: " + route_to_fetch)
        fetch(route_to_fetch,
            {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': 'true',
                },
                credentials: "include",
                mode: "cors",
                withCredentials: true,
                body: JSON.stringify(body),
            }
        ).then(handleFetchErrors)
            .then(response => {
                console.log("handleDelete Response: ", response)
                return response.json()
            }
            )
            .then(data => {
                // TODO: This returns data not found even when it's successful.
                console.log("handleDelete Data: ", data)
                if (this.props.delete_video_success_cb !== undefined) {
                    this.props.delete_video_success_cb(this.props.video_id)
                }

                if (this.props.delete_annotation_success_cb !== undefined) {
                    this.props.delete_annotation_success_cb(this.props.annotation_ts)
                }
            }
            )
            .catch(error => {
                console.log("handleDelete Error: " + error)
                if (this.props.delete_video_error_cb !== undefined) {
                    this.props.delete_video_error_error_cb(this.props.video_id)
                }

                if (this.props.delete_annotation_error_cb !== undefined) {
                    this.props.delete_annotation_error_cb(this.props.annotation_ts)
                }
            })
    }

    render() {
        console.log("In DeleteResource Render")
        return (
            < div className="deleteresource" >
                <div className="delete">
                    <Button variant="contained" onClick={() => this.handleDelete()}>{DELETE_BUTTON_TEXT}</Button>
                </div>
            </div >
        );
    }
}

export default DeleteResource;