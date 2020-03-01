/**
 * File: \src\screens\application.js
 * Project: alremote
 * Created Date: 29/02/2020 @ 11:16
 * Author: Marcus Setchell
 * -----
 * Last Modified: 01/03/2020 @ 11:52
 * Modified By: Marcus Setchell
 * -----
 */


/**
 * File: \src\screens\login.js
 * Project: alremote
 * Created Date: 29/02/2020 @ 10:51
 * Author: Marcus Setchell
 * -----
 * Last Modified: 29/02/2020 @ 11:16
 * Modified By: Marcus Setchell
 * -----
 */


const AL = require('../adventureland.js');
const config = require('../config.js');
const {Screen} = require('./../screen.js');
const {dialog} = require('electron');

module.exports.window = class extends Screen
{
	static open()
	{
		super.open({
			listener: this,
			channel: 'application',
			dev: false,
			maximize: true
		});
	}

	static on_open()
	{
		this.send_config();
		this.send_characters();
	}

	static on_logout()
	{
		this.send_status('Logging Out...');

		AL.logout();
		config.set('user', 'auto_login', false); //Disable this so we don't auto log back in
		
		this.window.hide();
		require('./login.js').window.open();
		this.window.close();
	}

	static on_get_scripts_directory()
	{
		let directory = dialog.showOpenDialogSync(this.window, {
			properties: ['openDirectory']
		});

		if(directory)
		{
			config.set('user', 'scripts_directory', directory[0]);
			this.send_config();
		}
	}

	static on_save_config(event, data)
	{
		this.send_status('Saving...');

		config.set('user', 'scripts_directory', data.scripts_directory);
		config.set('user', 'auto_login', data.auto_login);
		config.set('user', 'desktop_notifications', data.desktop_notifications);
		config.set('user', 'minimize_to_tray', data.minimize_to_tray);

		//If auto login is turned on, save the login email and pass
		if(data.auto_login)
		{
			config.set('user', 'al_email', config.get('cache', 'al_email'));
			config.set('user', 'al_pass', config.get('cache', 'al_pass'));
		}

		config.save('user');

		this.send_result(true, 'Your settings have been updated');
	}

	static on_deploy(event, data)
	{
		
	}

	static send_config()
	{
		this.send({
			method: 'update_config',
			scripts_directory: config.get('user', 'scripts_directory'),
			auto_login: config.get('user', 'auto_login'),
			desktop_notifications: config.get('user', 'desktop_notifications'),
			minimize_to_tray: config.get('user', 'minimize_to_tray')
		});
	}

	static send_characters()
	{
		this.send({
			method: 'characters',
			characters: AL.characters
		});
	}
}