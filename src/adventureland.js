/**
 * File: \src\adventureland.js
 * Project: alremote
 * Created Date: 29/02/2020 @ 17:33
 * Author: Marcus Setchell
 * -----
 * Last Modified: 01/03/2020 @ 11:56
 * Modified By: Marcus Setchell
 * -----
 */


const request = require('request-promise-native');

const UA = 'ALRemote 0.0.1';

module.exports = class
{
	static async login(email, pass)
	{
		var _self = this;

		return new Promise(async function(resolve, reject){

			await request({url: "https://adventure.land"}, function(error, response, body){
				//Boo
			});

			await request.post({
				url: 'https://adventure.land/api/signup_or_login',
				formData: {
					arguments: '{"email":"' + email + '","password":"' + pass + '","only_login":"true"}',
					method: "signup_or_login"
				},
				headers: {
					"X-Requested-With": "XMLHttpRequest",
					"Accept": "application/json, text/javascript, */*; q=0.01",
					"User-Agent": UA,
				}
			}, function(error, response, body){
				
				var body = JSON.parse(body);
				if(body[0].type == "message" && body[0].message == "Logged In!")
				{
					_self.auth = response.headers['set-cookie'][1].split(';')[0].substring(5);
					_self.uid = _self.auth.split('-')[0];

					resolve();
				}
				else
				{
					reject();
				}
			});
		});
	}

	static logout()
	{
		this.auth = null;
		this.uid = null;
	}

	static get_characters()
	{
		var _self = this;

		return new Promise(async function (resolve, reject){
			var html = await request.post({
				url: "https://adventure.land/api/servers_and_characters",
				headers: {cookie: "auth=" + _self.auth, "User-Agent": UA, "X-Requested-With": "XMLHttpRequest"},
				formData: {method: "servers_and_characters", arguments: "{}"}
			});
			let data = JSON.parse(html)[0];

			_self.characters = data.characters;
			resolve();
		});
	}

	static get_servers()
	{
		var _self = this;

		return new Promise(function (resolve, reject) {
			request.post({
				url: "https://adventure.land/api/get_servers",
				method: "POST",
				headers: {
					"User-Agent": UA,
					"X-Requested-With": "XMLHttpRequest",
					"Cookie": "auth=" + _self.auth
				},
				form: {
					method: "get_servers"
				}
			}).then(function(html){
				let data = JSON.parse(html);
				_self.servers = data[0].message;
				resolve();
			}).catch(function(){
				reject();
			});
		});
	}
}