import * as fs from 'node:fs';

const filePath = 'tasks.json';
const maxID = 50;

export function generateID(tasks) {
    const used = new Set(tasks.map(t => t.id));
    for (let i = 1; i <= maxID; i++) {
        if (!used.has(i)) return i;
    }
    return null;
}

export function getDateTime() {
    const date = new Date();
    const pad = (num) => num.toString().padStart(2, '0');

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());

    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export function readTasks() {
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

export function writeTasks(tasks) {
    fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2), 'utf8');
    return;
}