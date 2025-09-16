export type ID = string;

export type Role = "admin" | "manager" | "agent" | "viewer";
export type TaskStatus = "backlog" | "todo" | "in_progress" | "review" | "done";
export type Priority = "low" | "medium" | "high" | "critical";

export const NOW_ISO = () => new Date().toISOString();

export type ISODate = string;

// ========= Core Entities =========
export interface User {
    id: ID;
    name: string;
    role: Role;
}

export interface SLA {
    minutes: number;
    startAt?: ISODate;
    breached?: boolean;
}

export interface Task {
    id: ID;
    boardId: ID;
    title: string;
    description?: string;
    status: TaskStatus;
    priority: Priority;
    assigneeId?: ID;
    points?: number;

    createdAt: ISODate;
    updatedAt: ISODate;
    dueAt?: ISODate;

    sla?: SLA;
    tags?: string[];
    // for future: history: TaskEvent[]
}

export interface ColumnConfig {
    id: TaskStatus;
    title: string;
    wipLimit?: number; // when done - no new tasks able to send
}

export interface WorkflowRule {
    id: ID;
    when?: Partial<Pick<Task, "status" | "priority">>;
    then?: { autoAssignRole?: Role; addTag?: string; notify?: boolean };
}

export interface Workflow {
    id: ID;
    name: string;
    columns: ColumnConfig[];
    rules?: WorkflowRule[];
}

export interface Board {
    id: ID;
    name: string;
    ownerId: ID;
    memberIds: ID[];
    workflowId: ID;
}

export interface Sprint {
    id: ID;
    boardId: ID;
    name: string;
    start: ISODate;
    end: ISODate;
    taskIds: ID[];
}

// ========= Domain Invariants / Guards =========
export function canEnterWip(currentCount: number, limit?: number): boolean {
    if (limit == null) return true;
    return currentCount < limit;
}

export const ADJACENT_FLOW: Record<TaskStatus, TaskStatus[]> = {
    backlog: ["todo"],
    todo: ["backlog", "in_progress"],
    in_progress: ["todo", "review"],
    review: ["in_progress", "done"],
    done: ["review"],
};

export function canTransition(from: TaskStatus, to: TaskStatus): boolean {
    // by default "neighbouring" steps; can be loosened later
    return ADJACENT_FLOW[from]?.includes(to) ?? false;
}

export function startSLAIfNeeded(task: Task, nextStatus: TaskStatus): Task {
    if (nextStatus === "in_progress" && task.sla && !task.sla.startAt) {
        task = {
            ...task,
            sla: { ...task.sla, startAt: NOW_ISO() },
        };
    }
    return task;
}

export function tickSLA(task: Task, now: Date = new Date()): Task {
    if (!task.sla?.startAt || task.sla.breached) return task;
    const elapsedMin = (now.getTime() - new Date(task.sla.startAt).getTime()) / 60000;
    if (elapsedMin > task.sla.minutes) {
        return { ...task, sla: { ...task.sla, breached: true } };
    }
    return task;
}

// ========= Factories (good for tests/seeds) =========
export function makeTask(
    partial: Pick<Task, "title" | "boardId"> & Partial<Omit<Task, "title" | "boardId">>
): Task {
    const now = NOW_ISO();
    const { title, boardId, ...rest } = partial;

    return {
        id: cryptoRandomId(),
        title,
        boardId,
        status: rest.status ?? "backlog",
        priority: rest.priority ?? "medium",
        createdAt: now,
        updatedAt: now,
        ...rest,
    };
}

export function makeWorkflow(name = "Default"): Workflow {
    return {
        id: cryptoRandomId(),
        name,
        columns: [
            { id: "backlog", title: "Backlog" },
            { id: "todo", title: "To Do", wipLimit: 6 },
            { id: "in_progress", title: "In Progress", wipLimit: 4 },
            { id: "review", title: "Review", wipLimit: 3 },
            { id: "done", title: "Done" },
        ],
    };
}

export function makeBoard(ownerId: ID, name = "TaskOps Board", workflowId?: ID): Board {
    return {
        id: cryptoRandomId(),
        name,
        ownerId,
        memberIds: [ownerId],
        workflowId: workflowId ?? cryptoRandomId(),
    };
}

export function makeSprint(boardId: ID, name: string, start: Date, end: Date): Sprint {
    if (end <= start) throw new Error("Sprint.end must be after start");
    return {
        id: cryptoRandomId(),
        boardId,
        name,
        start: start.toISOString(),
        end: end.toISOString(),
        taskIds: [],
    };
}

// ========= Small portable id helper =========
function cryptoRandomId(): ID {
    // маленький helper без зовнішніх залежностей (не крипто-ідеальний, але ок для демо)
    return Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 10);
}
