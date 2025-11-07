# task-cli

A small file-based task tracker CLI written in Node.js. It stores tasks in `tasks.json` and provides simple commands to add, update, delete, mark, and list tasks. Project link - https://roadmap.sh/projects/task-tracker

## Prerequisites

- Node.js (v14+ recommended)
- npm (comes with Node.js)
 - Run `npm install` in the project root to install dependencies (for example: `yargs`).

## Install for development (recommended)

This project provides a local CLI name `task-cli`. To register it locally for development, run:

```bash
cd /path/to/task_tracker
npm install
npm link
```

After `npm link` you can run the CLI with the `task-cli` command from anywhere:

```bash
task-cli -h
```

## Install globally for other machines

To install globally without publishing, you can run from the project folder:

```bash
npm install -g /path/to/task_tracker
```

Or publish to npm and then install with `npm i -g <package-name>` (I can help if you want to publish).

## Usage

Run `task-cli -h` to see help. Example commands:

- Add a task

```bash
task-cli add "Buy groceries"
```

- Update a task description (id is numeric)

```bash
task-cli update 1 "Buy groceries and milk"
```

- Delete a task

```bash
task-cli delete 1
```

- Mark a task (valid statuses: `todo`, `in-progress`, `done`)

```bash
task-cli mark-done 1
task-cli mark-todo 2
task-cli mark-in-progress 3
```

- List tasks (optionally by status)

```bash
# list all
task-cli list

# list only todo
task-cli list todo
```

## Command reference

- `add <description>` — Add a new task with status `todo`.
- `update <id> <description>` — Update the description for task with id.
- `delete <id>` — Remove the specified task.
- `mark-done <id>` / `mark-todo <id>` / `mark-in-progress <id>` — Change task status and update timestamp.
- `list [status]` — Show tasks; when `status` is provided it filters by that status.

## Files

- `index.js` — CLI entrypoint. Uses `yargs` and the `bin` shebang to run as a command.
- `helpers.js` — File helpers: ID generation, date formatting, read/write `tasks.json`.
- `utils.js` — Task operations: add, update, list, delete, mark.
- `tasks.json` — Data file storing tasks (array). This file is created automatically if it doesn't exist.
- `package.json` — Project metadata and `bin` mapping for `task-cli`.

## Notes / implementation details

- The CLI uses ESM (`"type": "module"` in `package.json`) and `index.js` contains a node shebang so it can act as an executable.
- IDs are generated in the range 1..50 by `helpers.generateID`. If the ID pool is exhausted the CLI will refuse to add more tasks.
- Timestamps are in `YYYY-MM-DDTHH:MM` format (local time, minute precision).

## Troubleshooting

- If `task-cli` is not found after cloning the repo, run `npm link` in the project root.
- If you see permission errors when doing a global install, prefer `npm link` for dev or use a node version manager like `nvm` and avoid `sudo`.