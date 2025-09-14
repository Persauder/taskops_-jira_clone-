export type ID = string;

export type Role = "admin" | "manager" | "agent" | "viewer";
export type TaskStatus = "backlog" | "todo" | "inprogress" | "rewiew" | "done";
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