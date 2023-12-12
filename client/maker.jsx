const helper = require('./helper.js');
const React = require('react');
const ReactDOM = require('react-dom');

const handleSubmit = (e) => {
    e.preventDefault();
    helper.hideError();

    const name = e.target.querySelector('#setName').value;
    const id = e.target.querySelector('#setId').value;

    if (!name || !id) {
        helper.handleError('All fields are required!');
        return false;
    }

    helper.sendPost(e.target.action, { name, id }, loadPlaylists);

    return false;
}

const PlaylistForm = (props) => {
    return (
        <form id="playlistForm"
            onSubmit={handleSubmit}
            name="playlistForm"
            action="/maker"
            method="POST"
            className="playlistForm"
        >
            <label htmlFor="name">Playlist Name: </label>
            <input id="setName" type="text" name="name" placeholder="Playlist Title..." />
            <label htmlFor="age">Playlist Id: </label>
            <input id="setId" type="text" name="id" />
            <input className="submit" type="submit" value="Submit Playlist" />
        </form>
    )
}

const PlaylistArray = (props) => {

    if (props.playlists.length === 0) {
        return (
            <div className="emptyContainer">
                <h3 className='emptyText'>No Playlist Added Yet</h3>
            </div>
        );
    }
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


const NewPlaylistArray = (props) => {

    if (props.videosToAdd.length === 0) {
        return (
            <div className="emptyContainer">
                <h3 className='emptyText'>No Videos Added Yet</h3>
            </div>
        );
    }
    const newVideoNodes = props.videosToAdd.map(videos => {
        return (
            <p>{videos}</p>
        )
    })

    return (
        <div className='newVideoList'>
            {newVideoNodes}
        </div>
    )
}

//Will map all the videos once the button loaded in from PlayltArray is present
const VideoArray = (props) => {

    if (props.video.length === 0) {
        return (
            <div className="emptyContainer">
                <h3 className='emptyText'>No Playlist Rendered Yet</h3>
            </div>
        );
    }
    const [idArray, setShowNewDiv] = React.useState([]);

    const newPlaylistAdd = (props) => {
        const newArray = ([...idArray, props.snippet.resourceId.videoId]);
        setShowNewDiv(newArray);
        ReactDOM.render(
            <NewPlaylistArray videosToAdd={newArray} />,
            document.getElementById('newPlaylist')
        );
    };

    const videoNodes = props.video.map(videos => {
        return (
            <div className='video'>
                <p className="vidChannel">{videos.snippet.videoOwnerChannelTitle}</p>
                <p className="vidTitle">Title: {videos.snippet.title}</p>
                <p className="vidDate">Published At: {videos.snippet.publishedAt}</p>
                <img src={videos.snippet.thumbnails.default.url} alt='Thumbnail' className="vidImg"></img>
                <button onClick={() => newPlaylistAdd(videos)} className="vidButton">Add to Playlist</button>
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
const loadPlaylists = async () => {
    const response = await fetch('/setPlayList');
    const data = await response.json();
    ReactDOM.render(
        <PlaylistArray playlists={data.playlists} />,
        document.getElementById('showPlaylists')
    );
}

//loads all the videos from a given playlist when a button is pressed
const loadVideos = (videos) => {
    ReactDOM.render(
        <VideoArray video={videos} />,
        document.getElementById('videos')
    );
}


const init = () => {
    ReactDOM.render(
        <PlaylistForm />,
        document.getElementById('addPlaylist')
    );

    ReactDOM.render(
        <VideoArray video={[]} />,
        document.getElementById('videos')
    );

    ReactDOM.render(
        <PlaylistArray playlists={[]} />,
        document.getElementById('showPlaylists')
    );

    ReactDOM.render(
        <NewPlaylistArray videosToAdd={[]} />,
        document.getElementById('newPlaylist')
    );

    loadPlaylists();
}

window.onload = init;