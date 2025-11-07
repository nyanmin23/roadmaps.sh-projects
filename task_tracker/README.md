# task-cli

A small file-based task tracker CLI written in Node.js. It stores tasks in `tasks.json` and provides simple commands to add, update, delete, mark, and list tasks.

## Prerequisites

- Node.js (v14+ recommended)
- npm (comes with Node.js)

## Install for development (recommended)

This project provides a local CLI name `task-cli`. To register it locally for development, run:

```bash
cd /path/to/task_tracker
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

## Contributing / Future improvements

- Add unit tests and a small test harness for commands.
- Make the data file location configurable (e.g., `~/.task-cli/tasks.json` or via env var).
- Add more robust validation and better CLI output formatting.

## What I don't know (questions for you)

1. Do you want me to rename the `utils.js` exported functions from plural (e.g., `addTasks`) to singular (`addTask`) for clarity? I can update code accordingly.
2. Do you want a preferred license (MIT, Apache-2.0, etc.) and author name to add to `package.json` and this README?
3. Would you like me to add an `npm` publish workflow or instructions to publish this package?
4. Any specific example tasks or usage we should include in the README to illustrate real usage?

---

If you want, I can also:
- Rename the functions for clearer public API and update imports (no breaking behavior expected internally),
- Add a small `examples/` script that runs a sample flow (add -> list -> mark -> list),
- Add a minimal test script and an npm script to run it.

Tell me which of the above you'd like me to do next.