var url = 'http://localhost:4000/api/task';

// Note that this will not work in any version of IE.
fetch(url).then(function (response) {
	console.log(response);
});