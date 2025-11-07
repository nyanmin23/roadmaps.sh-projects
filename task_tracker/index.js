#!/usr/bin/env node
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import * as fs from 'node:fs';

const filePath = 'tasks.json';
const maxID = 50;
const defaultStatus = 'todo';
const taskStatus = ['done', 'todo', 'in-progress'];
const MAX_DESCRIPTION_LENGTH = 255;

let cli = yargs(hideBin(process.argv))
    .usage('Usage: task-cli [command]')

    .command('add <description>',
        'Add a new task',
        (yargs) => {
            yargs.positional('description', {
                describe: 'Task description',
                type: 'string',
            });
        }, (argv) => {
            addTask(argv.description)
        }
    )

    .command('update <id> <description>',
        'Update the task description',
        (yargs) => {
            yargs
                .positional('id', {
                    describe: 'Task id',
                    type: 'number',
                })

                .positional('description', {
                    describe: 'Task description',
                    type: 'string'
                });
        }, (argv) => {
            updateTask(argv.id, argv.description)
        }
    )

    .command('delete <id>',
        'Delete a task',
        (yargs) => {
            yargs.positional('id', {
                describe: 'Task id',
                type: 'number',
            });
        }, (argv) => {
            deleteTask(argv.id)
        }
    )

taskStatus.forEach(status => {
    cli = cli
        .command(
            `Mark task as ${status}`,
            `mark-${status} <id>`,
            yargs =>
                yargs.positional('id', { describe: 'Task id', type: 'number' }),
            argv => markTask(status, argv.id)
        );
});


cli = cli
    .command('list [status]',
        'List tasks by status',
        (yargs) => {
            yargs.positional('status', {
                describe: 'Task status',
                type: 'string',
                choices: ['todo', 'in-progress', 'done'],
            });
        }, (argv) => {
            listTasks(argv.status);
        }
    )

    .help('help')
    .alias('help', 'h')
    .version()
    .alias('version', 'v')
    .argv;


function getDateTime() {
    const date = new Date();
    const pad = (num) => num.toString().padStart(2, '0');

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1); // Months are 0-indexed
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());

    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function addTask(description) {
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


function generateID(tasks) {
    const used = new Set(tasks.map(t => t.id));
    for (let i = 1; i <= maxID; i++) {
        if (!used.has(i)) return i;
    }
    return null;
}


function updateTask(id, description) {
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

function readTasks() {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        if (!data.trim()) return [];
        const tasks = JSON.parse(data);
        return Array.isArray(tasks) ? tasks : [];
    } catch (err) {
        if (err.code === 'ENOENT') return [];
        console.error('Could not read tasks:', err.message);
        fs.writeFileSync(filePath, '[]', 'utf8');
        return [];
    }
}

function writeTasks(tasks) {
    fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2), 'utf8');
    return;
}

function listTasks(status = null) {
    let tasks = readTasks();

    if (!tasks) {
        console.error('Empty task list.');
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

function deleteTask(id) {
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

function markTask(status, id) {
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
