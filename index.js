'use strict';

let cluster = require('cluster');

let numCpus = require('os').cpus().length; 
let counter = 0;


function shuffle(a) {
	for (let i = a.length; i; i--) {
		let j = Math.floor(Math.random() * i);
		[a[i - 1], a[j]] = [a[j], a[i - 1]];
	}
}

module.exports = {
	ParList: class ParList {
		constructor (arr) {
			cluster.setupMaster({
				exec: __dirname + '/work.js'
			});
			this.elements = arr;
		}

		map(mapper) {
			return new Promise((resolve, reject) => {
				let results = [];
				let fn = mapper.toString();
				let jobs = numCpus;
				let args = this.elements;
				shuffle(args);

				for (let i = 0; i < numCpus; i ++) {
					let newWorker = cluster.fork(process.env);

					newWorker.once('message', msg => {
						let { res } = msg;
						jobs--;

						results = results.concat(res);

						if (jobs === 0) {
							resolve(results);
						}

						newWorker.kill();
						return;
					});

					let stepSize = args.length/numCpus;
					let theseArgs = args.slice(i * stepSize, (i * stepSize) + stepSize);

					newWorker.send({
						fn,
						args: theseArgs
					});
				}
			});
		}
	},

	Future: class Future {
		constructor (fn, args, env) {
			return new Promise((resolve, reject) => {
				this.handler = fn;

				cluster.setupMaster({
					exec: __dirname + '/background-worker.js'
				});

				this.thread = cluster.fork();
				this.thread.send({ fn: fn.toString(), args })

				this.thread.once('message', msg => {
					return resolve(msg.res);
				})
			});
		}
	}
}

