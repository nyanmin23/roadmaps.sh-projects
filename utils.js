import { generateID, getDateTime, readTasks, writeTasks } from './helpers.js';

const MAX_DESCRIPTION_LENGTH = 255;
const defaultStatus = 'todo';

export function addTasks(description) {
    let tasks = readTasks();

    if (description.length > MAX_DESCRIPTION_LENGTH) {
        return console.log(`Description must be less than ${MAX_DESCRIPTION_LENGTH} characters.`);
    }

    if (tasks.some(task => task.description === description)) {
        return console.log('Task already exists.');
    }

    const id = generateID(tasks);
    if (!id) {
        return console.log('Cannot add more tasks: all IDs (1-50) used.');
    }

    const dt = getDateTime();
    const newTask = {
        id: id,
        description: description,
        status: defaultStatus,
        createdAt: dt,
        updatedAt: dt,
    };
    tasks.push(newTask);

    writeTasks(tasks);
    console.log(`Task "${description}" added successfully.`);
    return;
}

export function updateTasks(id, description) {
    let tasks = readTasks();
    let found = false;

    if (description.length > MAX_DESCRIPTION_LENGTH) {
        return console.log(`Description must be less than ${MAX_DESCRIPTION_LENGTH} characters.`);
    }

    tasks.forEach(task => {
        if (task.id === id) {
            task.description = description;
            task.updatedAt = getDateTime();
            found = true;
        }
    });

    if (!found) {
        console.log('Task not found.');
        return;
    }
    writeTasks(tasks);
    console.log(`Task ${id} updated successfully.`);
    return;
}

export function listTasks(status = null) {
    let tasks = readTasks();

    if (tasks.length === 0) {
        console.log('Empty task list.');
        return;
    }
    if (!tasks) {
        console.log('Task list is not initiated.');
        return;
    }

    if (status) {
        console.log('Listing tasks with status:', status);
        tasks.forEach(task => {
            if (task.status === status) {
                console.log(task)
            }
        })
    } else {
        console.log('Listing all tasks.')
        tasks.forEach(tasks => {
            console.log(tasks)
        })
    }
    return;
}

export function deleteTasks(id) {
    let tasks = readTasks();
    const index = tasks.findIndex(task => task.id === id);
    if (index === -1) {
        console.log('Task not found.');
        return;
    } else {
        tasks.splice(index, 1);
        writeTasks(tasks);
        console.log(`Task ${id} deleted successfully.`);
        return;
    }
}

export function markTasks(status, id) {
    let tasks = readTasks();
    let found = false;
    tasks.forEach(task => {
        if (task.id === id) {
            task.status = status;
            task.updatedAt = getDateTime();
            found = true;
        }
    });
    if (!found) {
        console.log('Task not found.');
        return;
    }
    writeTasks(tasks);
    console.log(`Task ${id} marked as ${status}.`);
}