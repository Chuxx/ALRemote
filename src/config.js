/**
 * File: \src\config.js
 * Project: alremote
 * Created Date: 29/02/2020 @ 09:40
 * Author: Marcus Setchell
 * -----
 * Last Modified: 29/02/2020 @ 20:22
 * Modified By: Marcus Setchell
 * -----
 */


const fs = require('fs');

module.exports = class
{
	static files = {};
	static config = {};

	static get(id, key)
	{
		if(!(id in this.config)) return undefined;
		return this.config[id][key];
	}

	static set(id, key, value)
	{
		if(!(id in this.config)) this.config[id] = {};
		this.config[id][key] = value;
	}

	static save(id)
	{
		try
		{
			fs.writeFileSync(this.files[id], JSON.stringify(this.config[id]));
		}
		catch(error)
		{
			console.log(error);
			return false;
		}

		return true;
	}



	static load(id, filepath)
	{
		let config;

		this.files[id] = filepath;

		try
		{
			config = fs.readFileSync(filepath);
			config = JSON.parse(config);
		}
		catch(error)
		{
			if(error instanceof Error)
			{
				console.log('Config file ' + filepath + ' does not exist or is not readable');
			}
			else if(error instanceof SyntaxError)
			{
				console.log('Config file ' + filepath + ' contains invalid JSON');
			}
			else
			{
				console.log('Failed to load config file ' + filepath + ': Unknown error -');
				console.log(error);
			}

			return false;
		}

		this.config[id] = config;
		return true;
	}
}