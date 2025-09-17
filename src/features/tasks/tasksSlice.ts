import { createSlice, type PayloadAction, nanoid } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";
import type { Task, TaskStatus, ID } from "../../types/domain";

type TasksState = {
    byId: Record<ID, Task>;
    allIds: ID[];
};

const initialState: TasksState = { byId: {}, allIds: [] };

const tasksSlice = createSlice({
    name: "tasks",
    initialState,
    reducers: {
        seed(state, action: PayloadAction<Task[]>) {
            for (const t of action.payload) {
                state.byId[t.id] = t;
                if (!state.allIds.includes(t.id)) state.allIds.push(t.id);
            }
        },
        createLocal: {
            reducer(state, action: PayloadAction<Task>) {
                state.byId[action.payload.id] = action.payload;
                state.allIds.push(action.payload.id);
            },
            prepare(partial: Omit<Task, "id" | "createdAt" | "updatedAt">) {
                const now = new Date().toISOString();
                return {
                    payload: {
                        id: nanoid(),
                        createdAt: now,
                        updatedAt: now,
                        ...partial,
                    } as Task,
                };
            },
        },
    },
});

export const { seed, createLocal } = tasksSlice.actions;
export default tasksSlice.reducer;

/* ---------- Selectors ---------- */
export const selectTasks = (s: RootState) =>
    s.tasks.allIds.map((id) => s.tasks.byId[id]);

export const selectTasksByStatus =
    (status: TaskStatus) => (s: RootState) =>
        s.tasks.allIds
            .map((id) => s.tasks.byId[id])
            .filter((t) => t.status === status);
