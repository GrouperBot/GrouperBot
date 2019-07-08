import { join } from 'path';
import { readdir } from 'fs';
import { Collection } from "discord.js";
import { scheduleJob } from 'node-schedule';
import GrouperClient from "../structures/GrouperClient";
import GrouperTask from '../structures/GrouperTask';
import log from '../log';

export default class TaskStore extends Collection {
    /**
     * Creates a new store for tasks
     * 
     * @param {GrouperClient} client 
     */
    constructor(client) {
        super();

        /**
         * GrouperClient
         * 
         * @type {GrouperClient}
         */
        this.client = client;
    }

    /**
     * Handle task event
     * 
     * @param {string} task Task name
     */
    handle(task) {
        task = this.get(task);

        if (!task) {
            return;
        }

        task.run();

        /**
         * Emitted when a task is ran
         * 
         * @event GrouperClient#taskRan
         * @param task.name Name of the task ran
         */
        this.client.emit('taskRan', task.name);
    }

    /**
     * Register a task
     * 
     * @param {GrouperTask | Function} task
     */
    registertask(task) {
        if (typeof task === 'function') {
            task = new task(this.client);
        }

        if(!(task instanceof GrouperTask)) {
            throw new Error('Invalid task class: ' + task);
        }

        if (this.some(cmd => cmd.name === task.name)) {
            throw new Error(`task name "${task.name}" is already registered`);
        }

        this.set(task.name.toLowerCase(), task);

        scheduleJob(task.interval, () => this.handle(task.name.toLowerCase()));

        /**
         * Emitted when a task is registered
         * 
         * @event GrouperClient#taskRegistered
         * @param {GrouperTask} task task that was registered
         */
        this.client.emit('taskRegistered', task);
    }

    /**
     * Register tasks within a directory
     * 
     * @param {string} path 
     */
    async registerTasksIn(path) {
        readdir(path, (err, files) => {
            if (err) {
                throw new Error(err);
            }

            const taskFiles = files.filter(f => f.split('.').pop() === 'js');

            if (taskFiles.length == 0)
                return;

            let cPath, req;

            for (let taskFile of taskFiles) {
                cPath = join(path, taskFile);

                req = require(cPath);

                if (typeof req.default === 'function') {
                    this.registertask(req.default);
                }
            }
        })
    }
}