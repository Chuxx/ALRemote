/**
 * File: \src\screen.js
 * Project: alremote
 * Created Date: 29/02/2020 @ 11:33
 * Author: Marcus Setchell
 * -----
 * Last Modified: 29/02/2020 @ 18:36
 * Modified By: Marcus Setchell
 * -----
 */


const config = require('./config.js');
const {BrowserWindow, ipcMain} = require('electron');

var Screen = class
{
	static open(args)
	{
		this.listener = args.listener;
		this.channel = args.channel;

		this.window = new BrowserWindow({
			show: false,
			backgroundColor: '#FFF',
			icon: config.get('runtime', 'icon'),
			webPreferences: {
				nodeIntegration: true
			}
		});

		if('dev' in args && args.dev) this.window.openDevTools();

		this.window.setMenu(null);
		this.window.loadFile('assets/screens/' + this.channel + '/index.html');

		var _self = this;
		this.window.on('closed', function(){
			_self.window = null;
		});

		this.window.on('ready-to-show', function(){
			if(args.maximize) _self.window.maximize();
			_self.window.show();
			if('on_open' in _self.listener) _self.listener.on_open.call(_self.listener);
		});

		ipcMain.on(this.channel, function(event, data){
			_self.listener['on_' + data.method].call(_self.listener, event, data);
		});
	}

	static send(data)
	{
		this.window.webContents.send(this.channel, data);
	}

	static close()
	{
		this.window.close();
	}

	//HELPERS

	static send_status(message)
	{
		this.send({
			method: 'status',
			message: message
		});
	}

	static send_result(success, message)
	{
		this.send({
			method: 'result',
			success: success,
			message: message
		});
	}
}

var Renderer = class Renderer
{
	static open(channel, listener)
	{
		const {ipcRenderer} = require('electron');
		
		this.channel = channel;
		this.listener = listener;

		var _self = this;
		ipcRenderer.on(channel, function(event, data){
			_self.listener['on_' + data.method].call(_self.listener, event, data);
		});

		_self.listener.on_ready();
	}

	static send(data)
	{
		const {ipcRenderer} = require('electron');

		ipcRenderer.send(this.channel, data);
	}
}

module.exports = {
	Screen: Screen,
	Renderer: Renderer
};