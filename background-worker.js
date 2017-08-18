'use strict';

let cluster = require('cluster');
let _ = require('lodash');

if (cluster.isWorker) {
	process.on('message', msg => {
		let { fn, args } = msg;

		if (args && !_.isArray(args)) {
			args = [args]
		}

		let res = { res: eval(`(${fn})(${args.reduce((acc, val) => acc + ', ' + val)})`) }

		process.send(res);
	});
}

