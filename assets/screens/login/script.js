/**
 * File: \assets\login\script.js
 * Project: alremote
 * Created Date: 29/02/2020 @ 13:02
 * Author: Marcus Setchell
 * -----
 * Last Modified: 29/02/2020 @ 16:07
 * Modified By: Marcus Setchell
 * -----
 */


const {Renderer} = require('./../../../src/screen.js');

class login extends Renderer
{
	static on_ready()
	{
		this.frm_login = document.getElementById('frm_login');
		this.txt_email = this.frm_login.querySelector('input[name=email]');
		this.txt_pass = this.frm_login.querySelector('input[name=pass]');
		this.result = this.frm_login.querySelector('output');
		
		this.status = document.getElementById('status');
		this.status_message = this.status.querySelector('output');

		var _self = this;
		_self.frm_login.addEventListener('submit', function(e){
			e.preventDefault();

			if(this.txt_email == "") return _self.set_result(false, "Please enter your email address");
			if(this.txt_pass == "") return _self.set_result(false, "Please enter your email address");

			_self.send({
				method: 'login',
				email: _self.txt_email.value,
				pass: _self.txt_pass.value
			});
		});
	}

	static set_result(success, message)
	{
		if(success)
		{
			this.result.classList.remove('error');
			this.result.classList.add('success');
			this.result.innerHTML = message;
		}
		else
		{
			this.result.classList.remove('success');
			this.result.classList.add('error');
			this.result.innerText = message;
		}
	}

	static on_status(event, data)
	{
		console.log('status recieved');
		
		this.status_message.innerText = data.message;
		this.status.classList.remove('hidden');
		this.frm_login.classList.add('hidden');
	}

	static on_result(event, data)
	{
		this.set_result(data.success, data.message);
		this.status.classList.add('hidden');
		this.frm_login.classList.remove('hidden');
	}
}


window.addEventListener('DOMContentLoaded', function(){
	login.open('login', login);
});