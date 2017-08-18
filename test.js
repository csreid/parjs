'use strict';

let { Future } = require('./index');

function fib (n) {
	if (n < 2) { return 1 };
	return fib(n - 1) + fib(n - 2);
}

let fib30 = new Future(fib, 42);

console.log('Uh oh! Starting some shit in the background!');
console.time('startFib');
fib30
	.then(num => console.log('done', num)).catch(console.log)
	.then(() => console.timeEnd('startFib'));

console.log('But here I am, continuing to do things');
console.log('Blah blah blah');
console.log('64 * 123 = ' + (64 * 123));
console.log('I am unstoppable');
console.log('because I have background helpers');
