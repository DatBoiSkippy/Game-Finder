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

const DomoForm = (props) => {
    return (
        <form id="domoForm"
            onSubmit={handleDomo}
            name="domoForm"
            action="/maker"
            method="POST"
            className="domoForm"
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
                <h3 className="emptyDomo">No Playlists Yet!</h3>
            </div>
        );
    }

    const playlistNodes = props.playlists.map(playlist => {
        console.log(playlist);
        return (
            <div key={playlist._id} className="domo">
                <h3 className="domoName"> Name: {playlist.name} </h3>
                <h3 className="domoAge"> No. of videos: {playlist.videos.length} </h3>
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
    const videoNodes = props.video.map(videos => {
        return (
            <div className='video'>
                <p>Channel: {videos.snippet.videoOwnerChannelTitle}</p>
                <p>Title: {videos.snippet.title}</p>
                <p>Published At: {videos.snippet.publishedAt}</p>
                <button onclick={(e) => addVideos(props)}>Add to Playlist</button>
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
    ReactDOM.render(
        <VideoArray video={videos} />,
        document.getElementById('newPlaylist')
    );
}

const NewPlaylist = (props) => {

    function handleSubmit(e) {
        e.preventDefault();
        awaitGoogleAuth();
    }

    return (
        <form onSubmit={handleSubmit} className='container'>
            <button>Sign In</button>
        </form>
    );
}


const init = () => {
    ReactDOM.render(
        <DomoForm />,
        document.getElementById('makeDomo')
    );

    ReactDOM.render(
        <PlaylistArray playlists={[]} />,
        document.getElementById('showPlaylists')
    );

    ReactDOM.render(
        <NewPlaylist />,
        document.getElementById('newPlaylist')
    );

    loadDomosFromServer();
}

window.onload = init;