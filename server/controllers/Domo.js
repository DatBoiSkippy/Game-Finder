const models = require('../models');
const Domo = models.Domo;
const YOUTUBE_PLAYLIST_API = 'https://www.googleapis.com/youtube/v3/playlistItems';
const YOUTUBE_PLAYLIST_ID = 'PLCGaK2yqfY2IrJYnOnlgdmzWVUFXsRQXA';

const makerPage = async (req, res) => {
    return res.render('app');
}

const makeDomo = async (req, res) => {
    if (!req.body.name || !req.body.age || !req.body.level) {
        return res.status(400).json({ error: 'Name, age, and level are required!' });
    }

    const domoData = {
        name: req.body.name,
        age: req.body.age,
        level: req.body.level,
        owner: req.session.account._id,
    };

    try {
        const newDomo = new Domo(domoData);
        await newDomo.save();
        return res.status(201).json({ name: newDomo.name, age: newDomo.age, level: newDomo.level });
    } catch (err) {
        console.log(err); _PLAYL
        if (err.code === 11000) {
            return res.status(400).json({ error: 'Domo already exists!' });
        }
        return res.status(500).json({ error: 'An error occurred making domo!' });
    }
}

const getDomos = async (req, res) => {
    try {
        const query = { owner: req.session.account._id };
        const docs = await Domo.find(query).select('name age level').lean().exec();

        return res.json({ domos: docs });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Error retrieving domos!' });
    }
};

//Fetches the Youtube Data API which returns videos in a playlist given the playlist id, 
const getYoutubeAPI = async (req, res) => {
    try {
        const url = await fetch(`${YOUTUBE_PLAYLIST_API}?part=snippet&playlistId=${YOUTUBE_PLAYLIST_ID}&key=${process.env.YOUTUBE_API_KEY}`);
        const data = await url.json();
        return res.json( {videos: data});
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Error retrieving API' });
    }
};

module.exports = {
    makerPage,
    makeDomo,
    getDomos,
    getYoutubeAPI,
};
