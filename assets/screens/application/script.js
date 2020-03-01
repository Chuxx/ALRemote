/**
 * File: \assets\screens\application\script.js
 * Project: alremote
 * Created Date: 29/02/2020 @ 13:42
 * Author: Marcus Setchell
 * -----
 * Last Modified: 01/03/2020 @ 11:41
 * Modified By: Marcus Setchell
 * -----
 */


const {Renderer} = require('./../../../src/screen.js');

class application extends Renderer
{
	static on_ready()
	{
		this.has_status = false;

		this.panels = document.querySelectorAll('.panel');
		this.status = document.getElementById('status');
		this.status_message = this.status.querySelector('output');
		
		this.scripts_directory = document.getElementById('scripts_directory');
		this.desktop_notifications = document.querySelector('[name=desktop_notifications]');
		this.auto_login = document.querySelector('[name=auto_login]');
		this.minimize_to_tray = document.querySelector('[name=minimize_to_tray]');

		var _self = this;
		document.addEventListener('click', function(event){
			
			if(_self.has_status) return;

			if(event.target.classList.contains('open_dashboard')) return _self.open_panel('dashboard');
			if(event.target.classList.contains('open_scripts')) return _self.open_panel('scripts');
			if(event.target.classList.contains('open_settings')) return _self.open_panel('settings');
			if(event.target.classList.contains('logout')) return _self.logout();
			if(event.target.classList.contains('get_scripts_directory')) return _self.send({method: 'get_scripts_directory'});
			if(event.target.classList.contains('deploy')) return _self.send({method:"deploy",character:event.target.id});
		});

		document.getElementById('settings').addEventListener('submit', function(event){
			event.preventDefault();
			_self.save_config();
			return false;
		});
	}

	static open_panel(id)
	{
		var _self = this;
		this.panels.forEach(function(panel){
			if(panel.id === id)
			{
				panel.classList.add('active')
			}
			else if(panel.classList.contains('active'))
			{
				_self.last_panel = panel.id;
				panel.classList.remove('active');
			}
		});
	}

	static logout()
	{
		this.send({method: 'logout'});
	}

	static save_config()
	{
		this.send({
			method: 'save_config',
			scripts_directory: this.scripts_directory.value,
			desktop_notifications: this.desktop_notifications.checked,
			auto_login: this.auto_login.checked,
			minimize_to_tray: this.minimize_to_tray.checked,
		});
	}

	static on_status(event, data)
	{
		this.has_status = true;
		this.status_message.innerText = data.message;
		this.status.classList.remove('hidden');
		this.open_panel(null);
	}

	static on_result(event, data)
	{
		this.has_status = false;
		this.status_message.innerText = data.message;
		this.status.classList.add(data.success ? 'success' : 'error');
		
		var _self = this;
		setTimeout(function(){
			_self.status.classList.add('hidden');
			_self.status.classList.remove(data.success ? 'success' : 'error');
			_self.open_panel(_self.last_panel);
		}, 1500);
	}

	static on_update_config(event, data)
	{
		this.scripts_directory.value = data.scripts_directory;
		this.desktop_notifications.checked = data.desktop_notifications;
		this.auto_login.checked = data.auto_login;
		this.minimize_to_tray.checked = data.minimize_to_tray;
	}

	static on_characters(event, data)
	{
		this.characters = data.characters;

		for(var i in data.characters)
		{
			var c = data.characters[i];

			var status = (c.online) ? 'Online' : 'Offline';

			document.getElementById('dashboard').insertAdjacentHTML('beforeend', `
			<div class="character">
				<dl>
					<dt>Name</dt><dd class="name">` + c.name + `</dd>
					<dt>Level</dt><dd class="level">` + c.level + `</dd>
					<dt>Type</dt><dd class="type">` + c.type + `</dd>
					<dt>Gender</dt><dd class="gender">` + c.gender + `</dd>
					<dt>Status</dt><dd class="status">` + status + `</dd>
				</dl>
				<hr>
				<input type="button" value="Deploy" class="deploy" id="` + c.id + `">
			</div>`);
		}
	}
}


window.addEventListener('DOMContentLoaded', function(){
	application.open('application', application);
});
