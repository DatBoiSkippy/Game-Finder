const mongoose = require('mongoose');
const _ = require('underscore');

const setName = (name) => _.escape(name).trim();

const VideoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        set: setName,
    },
    playlist: {
        type: String,
        required: true,
    },
    videos: {
        type: Array,
    },
    owner: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'Account',
    },
    createdDate: {
        type: Date,
        default: Date.now,
    },
});

VideoSchema.statics.toAPI = (doc) => ({
    name: doc.name,
    id: doc.id,
});

const VideoModel = mongoose.model('Playlist', VideoSchema);
module.exports = VideoModel;