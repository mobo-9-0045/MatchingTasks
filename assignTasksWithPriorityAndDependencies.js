const sort_tasks = (tasks) =>{
    tasks.sort((a, b) => b.priority - a.priority);
    const taskMap = new Map();
    const inDegree = new Map();
    tasks.forEach(task => {
        taskMap.set(task.taskName, task);
        inDegree.set(task.taskName, 0);
    });
    tasks.forEach(task => {
        task.dependencies.forEach(dep => {
            if (inDegree.has(dep)) {
                inDegree.set(dep, inDegree.get(dep) + 1);
            }
        });
    });
    const sorted = [];
    const queue = Array.from(inDegree.keys()).filter(task => inDegree.get(task) === 0);
    while (queue.length) {
        const taskName = queue.shift();
        sorted.push(taskMap.get(taskName));

        tasks.forEach(task => {
            if (task.dependencies.includes(taskName)) {
                inDegree.set(task.taskName, inDegree.get(task.taskName) - 1);
                if (inDegree.get(task.taskName) === 0) {
                    queue.push(task.taskName);
                }
            }
        });
    }
    return sorted;
}

const assignTasksWithPriorityAndDependencies = (developers, tasks) =>{
    let assigned = developers.map(dev => ({
        name: dev.name,
        assignedTasks: [],
        totalHours: 0
    }));
    unassignedTasks = [];
    const sortedTasks = sort_tasks(tasks);
    sortedTasks.forEach(task =>{
        let taskAssigned = false;
        developers.forEach(developer =>{
            if (task.difficulty <= developer.skillLevel){
                assigned.forEach(a => {
                    if (a.name === developer.name) {
                        a.assignedTasks.push(task.taskName); // Add task name
                        a.totalHours += task.hoursRequired; // Increment total hours
                    }
                });
                taskAssigned = true;
                return;
            }
        });
        if (!taskAssigned) {
            unassignedTasks.push(task.taskName);
        }
    })
    return {
        assigned,
        unassignedTasks
    };
}

const developers = [
    { name: 'Alice', skillLevel: 7, maxHours: 40, preferredTaskType: 'feature' },
    { name: 'Bob', skillLevel: 9, maxHours: 30, preferredTaskType: 'bug' },
    { name: 'Charlie', skillLevel: 5, maxHours: 35, preferredTaskType: 'refactor' },
];

const tasks = [
    { taskName: 'Feature A', difficulty: 7, hoursRequired: 15, taskType: 'feature', priority: 4, dependencies: [] },
    { taskName: 'Bug Fix B', difficulty: 5, hoursRequired: 10, taskType: 'bug', priority: 5, dependencies: [] },
    { taskName: 'Refactor C', difficulty: 9, hoursRequired: 25, taskType: 'refactor', priority: 3, dependencies: ['Bug Fix B'] },
    { taskName: 'Optimization D', difficulty: 6, hoursRequired: 20, taskType: 'feature', priority: 2, dependencies: [] },
    { taskName: 'Upgrade E', difficulty: 8, hoursRequired: 15, taskType: 'feature', priority: 5, dependencies: ['Feature A'] },
];

const matching = assignTasksWithPriorityAndDependencies(developers, tasks);
console.log(matching);