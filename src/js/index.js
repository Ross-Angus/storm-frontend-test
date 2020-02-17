var url          = 'http://localhost:4000/api/task',
	taskList     = document.querySelector('[data-js="tasklist"]'), // A DIV in the mark-up
	taskFragment = document.createElement('ul');

// Note that this will not work in any version of IE.
fetch(url).then(function (response) {
	return response.json();
}).then(function (json) {
	for (var i = 0; i < json.length; i++) {
		var task = document.createElement('li');
		task.innerHTML = json[i].title;
		taskFragment.appendChild(task);
	}
	// This way, the DOM is only updated once.
	taskList.appendChild(taskFragment);
}).catch(function (err) {
	console.log('Fetch problem: ' + err.message);
});