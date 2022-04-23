export default {
    // URL for the server.
    SERVER: "https://elara-backend.herokuapp.com/v1",
    YT_WATCH_URL: "http://www.youtube.com/watch?v=",
    LOGIN_ROUTE: "/",
    SESSION_ROUTE: "/session",
    VIDEO_ANNOTATOR_BASE_ROUTE: "/annotate",

    // Server route to hit for Google OAuth login.
    SERVER_ROUTE_GOOGLE_OAUTH_LOGIN: "/oauth/google/login",
    // Server route to hit for password based login.
    SERVER_ROUTE_PASSWORD_LOGIN: "/login",
    // Server route to hit to logout an authenticated user.
    SERVER_ROUTE_LOGOUT: "/logout",
    // Server route to hit to get a user's annotated videos.
    SERVER_ROUTE_LIST: "/list",
    // Server route to get annotations for a video.
    SERVER_ROUTE_ANNOTATIONS: "/annotations",
    // Server route to store annotations for a video
    SERVER_ROUTE_ADD_ANNOTATION: "/add",
}