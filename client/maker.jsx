const helper = require('./helper.js');
const React = require('react');
const ReactDOM = require('react-dom');

const handleDomo = (e) => {
    e.preventDefault();
    helper.hideError();

    const name = e.target.querySelector('#domoName').value;
    const id = e.target.querySelector('#domoAge').value;

    if (!name || !id) {
        helper.handleError('All fields are required!');
        return false;
    }

    helper.sendPost(e.target.action, { name, id }, loadDomosFromServer);

    return false;
}

const PlaylistForm = (props) => {
    return (
        <form id="playlistForm"
            onSubmit={handleDomo}
            name="playlistForm"
            action="/maker"
            method="POST"
            className="playlistForm"
        >
            <label htmlFor="name">Playlist Name: </label>
            <input id="domoName" type="text" name="name" placeholder="Playlist Title..." />
            <label htmlFor="age">Playlist Id: </label>
            <input id="domoAge" type="text" name="id" />
            <input className="makeDomoSubmit" type="submit" value="Submit Playlist" />
        </form>
    )
}

//This will map the data from (currently {loadDomosFromServer})
const PlaylistArray = (props) => {

    if (props.playlists.length === 0) {
        return (
            <div>
                <h3 className="emptyPlaylistContainer">No Playlists Yet!</h3>
            </div>
        );
    }
    console.log(props.playlists);
    const playlistNodes = props.playlists.map(playlist => {
        return (
            <div key={playlist._id} className="playlist">
                <h3 className="playlistName">{playlist.name}</h3>
                <h3 className="numberOfVideos"> No. of videos: {playlist.videos.length} </h3>
                <button onClick={(e) => loadVideos(playlist.videos)}> Show Videos </button>
            </div>
        );
    });

    return (
        playlistNodes
    );
}

//Will map all the videos once the button loaded in from PlaylistArray is present
const VideoArray = (props) => {
    console.log(props);
    const videoNodes = props.video.map(videos => {
        return (
            <div className='video'>
                <p>Channel: {videos.snippet.videoOwnerChannelTitle}</p>
                <p>Title: {videos.snippet.title}</p>
                <p>Published At: {videos.snippet.publishedAt}</p>
                <img src={videos.snippet.thumbnails.default.url} alt='Thumbnail'></img>
                <button onclick={addVideos(videos)}>Add to Playlist</button>
            </div>
        );
    });

    return (
        <div className='videoList'>
            {videoNodes}
        </div>
    )
}

//Modified to get information about a given playlist in the database, rename to {loadPlaylistsFromServer}
const loadDomosFromServer = async () => {
    const response = await fetch('/setPlayList');
    const data = await response.json();
    ReactDOM.render(
        <PlaylistArray playlists={data.playlists} />,
        document.getElementById('showPlaylists')
    );
}

const awaitGoogleAuth = async () => {
    const response = await fetch('/getAuth');
    const data = await response.json();
    console.log(data);
}

//loads all the videos from a given playlist when a button is pressed
const loadVideos = (videos) => {
    ReactDOM.render(
        <VideoArray video={videos} />,
        document.getElementById('videos')
    );
}

const addVideos = (videos) => {
}

const Authorize = (props) => {

    function handleAuth(e) {
        e.preventDefault();
        awaitGoogleAuth();
    }

    return (
        <form onSubmit={handleAuth} className='buttonContainer'>
            <button>Sign In</button>
        </form>
    );
}

const Execute = (props) => {
    function handleExecute(e) {

    }
}

const init = () => {
    ReactDOM.render(
        <PlaylistForm />,
        document.getElementById('addPlaylist')
    );

    ReactDOM.render(
        <PlaylistArray playlists={[]} />,
        document.getElementById('showPlaylists')
    );

    ReactDOM.render(
        <Authorize />,
        document.getElementById('executeButtons')
    );

    loadDomosFromServer();
}

window.onload = init;