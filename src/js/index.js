// This is normal.
import '../css/index.scss';
var url          = 'http://localhost:4000/api/task',
	taskList     = document.querySelector('[data-js="tasklist"]'), // A DIV in the mark-up
	taskFragment = document.createElement('ul'),
	addTaskForm  = document.querySelector('[data-js="add-task-form"]');

taskFragment.className = 'list-flat';
// Adds a loading indication, while the results are fetched.
taskList.innerHTML = "<p>Loading to do list ...</p>";

// Writes the whole task list to the DOM
function updateUI() {
	// Note that this will not work in any version of IE.
	fetch(url).then(function (response) {
		return response.json();
	}).then(function (json) {
		for (var i = 0; i < json.length; i++) {
			taskFragment.appendChild(addToTaskList(json[i], i));
		}
		taskList.innerHTML = ''; // Remove the loading text
		taskList.appendChild(taskFragment);
		// The DOM has been updated. Time for some setup.
		taskInit();
	}).catch(function (err) {
		console.log('Fetch problem: ' + err.message);
	});
}
updateUI();

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

//
addTaskForm.addEventListener('submit', addTask);

function addTask(e) {
	var rightNow = new Date().toISOString(),
		guid = uuidv4(),
		taskTitle = document.getElementById('task-title').value,
		taskImportance = parseInt(document.getElementById('new-task-importance').value),
		data = {
		"id": guid,
		"title": taskTitle,
		"isDone": "false",
		"importance": taskImportance,
		"createdAt": rightNow,
		"updatedAt": rightNow
	};

	fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	})
	.then((response) => response.json())
	.then((data) => {
		var list = taskList.querySelector('ul');
		// Adds the new task to the DOM
		list.appendChild(addToTaskList(data, list.children.length));
		// Close the add task form
		document.getElementById('add-toggle').checked = false;
	})
	.catch((error) => {
		console.error('Error: ', error);
	});
	debugJSON();
	e.preventDefault();
}

// Writes a specific task to the DOM
// data is a fragment of the JSON representing a single task
// position is where in the task list this needs to appear
function addToTaskList(data, position) {
	var task = document.createElement('li'),
		checkedState = '';

	// This ensures that the "isDone" property of the JSON is reflected in the front end
	if (data.isDone === 'true') checkedState = ' checked';
	task.className = 'importance-' + data.importance;
	task.innerHTML = '<input type="checkbox" class="sr-only" name="task' + position + '" id="task' + position + '" data-id="' + data.id + '" ' + checkedState + '><label class="chunky-check" for="task' + position + '">' + data.title + '</label>';
	return task;
}

// Used to generate a GUID
function uuidv4() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
		var r = Math.random() * 16 | 0,
			v = c == 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(16);
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