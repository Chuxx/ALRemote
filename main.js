/**
 * File: \main.js
 * Project: alremote
 * Created Date: 29/02/2020 @ 09:39
 * Author: Marcus Setchell
 * -----
 * Last Modified: 29/02/2020 @ 20:30
 * Modified By: Marcus Setchell
 * -----
 */


//Load external modules
const join_path = require('path.join');
const {app} = require('electron');
const config = require('./src/config.js');

//Setup our runetime config
config.set('runtime', 'config_dir', app.getPath('userData'));
config.set('runtime', 'icon', join_path(__dirname, 'assets', 'img', 'alremote.png'));

//Setup default config
config.set('user', 'scripts_directory', app.getPath('documents'));
config.set('user', 'auto_login', false);
config.set('user', 'desktop_notifications', false);
config.set('user', 'minimize_to_tray', false);

//Load user specific config file (will write over defaults)
config.load('user', join_path(config.get('runtime', 'config_dir'), 'config.json'));



//Setup the electron app
app.allowRendererProcessReuse = true;

app.on('window-all-closed', function(){
	app.quit();
});

app.on('ready', function(){
	require('./src/screens/login.js').window.open();
});
