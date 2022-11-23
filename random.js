// https://www.johndcook.com/blog/cpp_TR1_random/
// https://stackoverflow.com/questions/28461796/randomint-function-that-can-uniformly-handle-the-full-range-of-min-and-max-safe
// https://en.cppreference.com/w/cpp/numeric/random/normal_distribution
// http://www.jbox.dk/sanos/source/lib/stdlib.c.html

// GLIBC pseudo-random number generator
// https://www.mscs.dal.ca/~selinger/random/
// https://stackoverflow.com/questions/18634079/glibc-rand-function-implementation
// https://blog.csdn.net/apparchitect/article/details/52892212

// 2 ** 31 - 1 = 2147483647 
// 2 ** 32 = 4294967296 


function GnuRand (seed) {
	this.n = 0;
	this.r = [];
	for (var i = 0; i < 1000; i ++) {
		this.r.push(0);
	}
	this.r[0] = seed;
	for (var i = 1; i < 31; i ++) {
		this.r[i] = (16807 * this.r[i - 1]) % 2147483647;
		if (this.r[i] < 0) {
			this.r[i] += 2147483647;
		}
	}
	for (var i = 31; i < 34; i ++) {
		this.r[i] = this.r[i - 31];
	}
	for (var i = 34; i < 344; i ++) {
		// this.r[i] = math.mod(math.add(this.r[i - 31], this.r[i - 3]), 4294967296);
		this.r[i] = (this.r[i - 31] + this.r[i - 3]) % 4294967296;
	}
}
GnuRand.prototype = {
	next: function () {
		this.r[this.n % 344] = (this.r[(this.n + 313) % 344] + this.r[(this.n + 341) % 344]) % 4294967296;
		// console.log(this.r[(this.n + 313) % 344], this.r[(this.n + 341) % 344]);
		// console.log(this.r[this.n % 344]);
		// this.r[this.n % 344] = math.mod(math.add(this.r[(this.n + 313) % 344], this.r[(this.n + 341) % 344]), 4294967296);
		var x = parseInt(this.r[this.n % 344] / 2);
		// var x = math.rightArithShift(this.r[this.n % 344], 1);
		if (x < 0) {
			x += 2147483647;
		}
		this.n = (this.n + 1) % 344;
		return x;
	}
};

var Rnd = new GnuRand(1);

for(var i = 0; i < 60; i ++){
	console.log(Rnd.next());
}
