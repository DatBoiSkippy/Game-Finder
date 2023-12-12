const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
    app.get('/setPlayList', mid.requiresLogin, controllers.Playlist.setPlayList);

    app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
    app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);

    app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

    app.get('/logout', mid.requiresLogin, controllers.Account.logout);

    app.get('/premium', mid.requiresLogin, controllers.Account.premium);

    app.get('/maker', mid.requiresLogin, controllers.Playlist.makerPage);
    app.post('/maker', mid.requiresLogin, controllers.Playlist.getPlayList);

    app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;