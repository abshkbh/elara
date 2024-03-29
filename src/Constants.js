export default {
    // URL for the server.
    SERVER: "https://elara-backend.herokuapp.com/v1",

    // Base URL to load a Youtube embedded player.
    YT_WATCH_URL: "http://www.youtube.com/watch?v=",

    // React Router path for the |Login| component.
    APP_ROUTE_LOGIN: "/",
    // React Router path for the |Session| component.
    APP_ROUTE_SESSION: "/session",
    // React Router path for the |VideoAnnotator| component.
    APP_ROUTE_VIDEO_ANNOTATOR: "/annotate",

    // Server route to hit for Google OAuth login.
    SERVER_ROUTE_GOOGLE_OAUTH_LOGIN: "/oauth/google/login",
    // Server route to hit for password based login.
    SERVER_ROUTE_PASSWORD_LOGIN: "/login",
    // Server route to hit to logout an authenticated user.
    SERVER_ROUTE_LOGOUT: "/logout",
    // Server route to hit to get a user's annotated videos.
    SERVER_ROUTE_LIST: "/list",
    // Delete an annotated video.
    SERVER_ROUTE_DELETE_VIDEO: "/delete/video",
    // Server route to get annotations for a video.
    SERVER_ROUTE_ANNOTATIONS: "/annotations",
    // Server route to store annotations for a video
    SERVER_ROUTE_ADD_ANNOTATION: "/add",
    // Delete an annotation.
    SERVER_ROUTE_DELETE_ANNOTATION: "/delete/annotation",

    // The app deals with two types of resources -
    // - Videos being annotated.
    // - Annotations per video.
    resourceType: Object.freeze({
        video: 0,
        annotation: 1
    }),
}

