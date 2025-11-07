#!/usr/bin/env node
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { addTasks, updateTasks, listTasks, deleteTasks, markTasks } from './utils.js';

const taskStatus = ['done', 'todo', 'in-progress'];

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
            addTasks(argv.description)
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
            updateTasks(argv.id, argv.description)
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
            deleteTasks(argv.id)
        }
    )

taskStatus.forEach(status => {
    cli = cli
        .command(
            `mark-${status} <id>`,
            `Mark task as ${status}`,
            yargs =>
                yargs.positional('id', { describe: 'Task id', type: 'number' }),
            argv => markTasks(status, argv.id)
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