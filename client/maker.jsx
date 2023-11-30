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

    helper.sendPost(e.target.action, {name, id}, loadDomosFromServer);

    return false;
}

const domoForm = (props) => {
    return (
        <form id="domoForm"
            onSubmit={handleDomo}
            name="domoForm"
            action="/maker"
            method="POST"
            className="domoForm"
        >
            <label htmlFor="name">Playlist Name: </label>
            <input id="domoName" type="text" name="name" placeholder="Domo Name" />
            <label htmlFor="age">Playlist Id: </label>
            <input id="domoAge" type="text" name="id" />
            <input className="makeDomoSubmit" type="submit" value="Make Domo" />
        </form>
    )
}

//This will map the data from (currently {loadDomosFromServer})
const PlaylistArray = (props) => {

    if (props.playlists.length === 0) {
        return (
            <div className="domoList">
                <h3 className="emptyDomo">No Playlists Yet!</h3>
            </div>
        );
    }

    const playlistNodes = props.playlists.map(playlist => {
        console.log(playlist.videos.length);
        return (
            <div key={playlist._id} className="domo">
                <h3 className="domoName"> Name: {playlist.name} </h3>
                <h3 className="domoAge"> Number of videos: {playlist.videos.length} </h3>
                <button onClick={(e) => loadPlayList(playlist.videos)}> Show Videos </button>
            </div>
        );
    });

    return (
        <div className="domoList">
            {playlistNodes}
        </div>
    );
}

const VideoArray = (props) => {
    const videoNodes = props.map(videos => {
        return (
            <div className='videos'>
                <img src={videos.snippet}></img>
            </div>
        )
    })
}

const loadDomosFromServer = async () => {
    const response = await fetch('/setPlayList');
    const data = await response.json();
    ReactDOM.render(
        <PlaylistArray playlists={data.playlists} />,
        document.getElementById('domos')
    );
}

const loadPlayList = (videos) => {
    console.log(videos);
}

const init = () => {
    ReactDOM.render(
        <domoForm />,
        document.getElementById('makeDomo')
    );

    ReactDOM.render(
        <PlaylistArray playlists={[]} />,
        document.getElementById('domos')
    );
    
    loadDomosFromServer();
    //loadPlayList();
}

window.onload = init;