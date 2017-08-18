'use strict';

let cluster = require('cluster');

if (cluster.isWorker) {
	process.on('message', msg => {
		let { args, fn } = msg;

		let res = { res: args.map(eval(fn)) }

		process.send(res);
	});
}
