// This is normal.
import '../css/index.scss';
var url          = 'http://localhost:4000/api/task',
	taskList     = document.querySelector('[data-js="tasklist"]'), // A DIV in the mark-up
	taskFragment = document.createElement('ul');

taskFragment.className = 'list-flat';
// Adds a loading indication, while the results are fetched.
taskList.innerHTML = "<p>Loading to do list ...</p>";

// Note that this will not work in any version of IE.
fetch(url).then(function (response) {
	return response.json();
}).then(function (json) {
	for (var i = 0; i < json.length; i++) {
		var task = document.createElement('li'),
			checkedState = '';

		// This ensures that the "isDone" property of the JSON is reflected in the front end
		if (json[i].isDone === 'true') checkedState = ' checked';
		task.className = 'importance-' + json[i].importance;
		task.innerHTML = '<input type="checkbox" class="sr-only" name="task' + i + '" id="task' + i + '" data-id="' + json[i].id + '" '+ checkedState +'><label class="chunky-check" for="task' + i + '">' + json[i].title + '</label>';
		taskFragment.appendChild(task);
	}
	taskList.innerHTML = ''; // Remove the loading text
	taskList.appendChild(taskFragment);
	// The DOM has been updated. Time for some setup
	taskInit();
}).catch(function (err) {
	console.log('Fetch problem: ' + err.message);
});

// Some basic setup, once everything's in the DOM
function taskInit() {
	// These power the tasks being flagged as done or not
	var checkboxes = [...taskList.querySelectorAll('[type="checkbox"]')];
	for (var i = 0; i < checkboxes.length; i++) {
		// The user has clicked on a task!
		checkboxes[i].addEventListener('change', function () {
			update(this);
		});
	}
}

function update(task) {
	var nodeID = task.getAttribute('data-id'),
		isChecked = task.checked ? 'true' : 'false';

	// We need to toggle the isDone property
	fetch(url + '/' + nodeID, {
		headers: {
			"Content-Type": "application/json; charset=utf-8"
		},
		method: 'PATCH',
		body: JSON.stringify({
			isDone: isChecked
		})
	}).catch(function (err) {
		console.log('Fetch problem: ' + err.message);
	});
}

// Just so I can have a wee sneaky peek at the JSON on the server
function debugJSON() {
	fetch(url).then(function (response) {
		return response.json();
	}).then(function (json) {
		console.log(json);
	}).catch(function (err) {
		console.log('Fetch problem: ' + err.message);
	});
}