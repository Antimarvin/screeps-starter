
class TaskRequest {
    task: TaskAction;
    status: "PENDING"|"INPROCESS"|"COMPLETE";
}

class TaskAction {
    prereqs: TaskPrerequisite[];
    action: (creep: Creep) => boolean;
}
