/**
 * File: \src\screens\login.js
 * Project: alremote
 * Created Date: 29/02/2020 @ 10:51
 * Author: Marcus Setchell
 * -----
 * Last Modified: 01/03/2020 @ 11:52
 * Modified By: Marcus Setchell
 * -----
 */


const config = require('../config.js');
const {Screen} = require('../screen.js');
const AL = require('../adventureland.js');

module.exports.window = class extends Screen
{
	static open()
	{
		super.open({
			listener: this,
			channel: 'login',
			dev: false
		});
	}

	static on_open()
	{
		if(config.get('user', 'auto_login'))
		{
			this.on_login(null, {
				email: config.get('user', 'al_email'),
				pass: config.get('user', 'al_pass')
			});
		}
	}

	static on_login(event, data)
	{
		this.send_status('Logging In...');

		var _self = this;
		AL.login(data.email, data.pass).then(function(){
			_self.send_status('Loading Characters...');

			//Cache the users email and pass in case they decide to turn auto_login on
			config.set('cache', 'al_email', data.email);
			config.set('cache', 'al_pass', data.pass);

			AL.get_characters().then(function(){

				_self.send_status('Loading Servers...');

				AL.get_servers().then(function(){

					_self.window.hide();
					require('./application.js').window.open();
					_self.window.close();

				}).catch(function(){
					_self.send_result(false, 'Failed to load servers');
				});
			}).catch(function(){
				_self.send_result(false, 'Failed to load characters');
			});
		}).catch(function(){
			_self.send_result(false, 'Invalid email address or password');
		});
	}
}