const models = require('../models');
const playlists = models.Playlists;
const YOUTUBE_PLAYLIST_ITEMS_API = 'https://www.googleapis.com/youtube/v3/playlistItems';
const YOUTUBE_PLAYLIST_API = 'https://www.googleapis.com/youtube/v3/playlists';
const YOUTUBE_PLAYLIST_ID = 'PLCGaK2yqfY2IrJYnOnlgdmzWVUFXsRQXA';

const makerPage = async (req, res) => {
    return res.render('app');
}

//Change to SetPlayList Later
const makeDomo = async (req, res) => {
    if (!req.body.name || !req.body.id) {
        return res.status(400).json({ error: 'Name, and playlist ID are required!' });
    }
    let playlistData = {};

    try {
        const url = await fetch(`${YOUTUBE_PLAYLIST_ITEMS_API}?part=snippet&playlistId=${req.body.id}&key=${process.env.YOUTUBE_API_KEY}`);
        const data = await url.json();
        console.log(data);
        console.log(data.items);
        playlistData = {
            name: req.body.name,
            playlist: req.body.id,
            owner: req.session.account._id,
            videos: data.items,
        };
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Error retrieving info' });
    }

    try {
        const addPlayList = new playlists(playlistData);
        await addPlayList.save();
        return res.status(201).json({ name: addPlayList.name, playlist: addPlayList.id, videos: addPlayList.videos });
    } catch (err) {
        console.log(err);
        if (err.code === 11000) {
            return res.status(400).json({ error: 'Playlist already exists!' });
        }
        return res.status(500).json({ error: 'An error occurred making domo!' });
    }
}

const setPlayList = async (req, res) => {
    try {
        const query = { owner: req.session.account._id };
        const docs = await playlists.find(query).select('name playlist videos').lean().exec();
        console.log(docs);
        return res.json({ playlists: docs });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Error retrieving domos!' });
    }
};

//Fetches the Youtube Data API which returns videos in a playlist given the playlist id, 
const getYoutubeAPI = async (req, res) => {
    try {
        const query = { owner: req.session.account._id };
        const id = await playlists.find(query).select('name playlist').lean().exec();
        const url = await fetch(`${YOUTUBE_PLAYLIST_ITEMS_API}?part=snippet&playlistId=${YOUTUBE_PLAYLIST_ID}&key=${process.env.YOUTUBE_API_KEY}`);
        const data = await url.json();
        return res.json({ videos: data });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Error retrieving API' });
    }
};

module.exports = {
    makerPage,
    makeDomo,
    setPlayList,
    getYoutubeAPI,
};
