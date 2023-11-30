const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
    app.get('/setPlayList', mid.requiresLogin, controllers.Domo.setPlayList);

    app.get('/getYoutubeAPI', mid.requiresLogin, controllers.Domo.getYoutubeAPI);

    app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
    app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);

    app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

    app.get('/logout', mid.requiresLogin, controllers.Account.logout);

    app.get('/maker', mid.requiresLogin, controllers.Domo.makerPage);
    app.post('/maker', mid.requiresLogin, controllers.Domo.makeDomo);

    app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;