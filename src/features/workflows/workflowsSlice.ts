import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Workflow, TaskStatus } from "../../types/domain";

const defaultWorkflow: Workflow = {
    id: "wf-default",
    name: "Default Workflow",
    columns: [
        { id: "backlog", title: "Backlog" },
        { id: "todo", title: "To Do", wipLimit: 6 },
        { id: "in_progress", title: "In Progress", wipLimit: 4 },
        { id: "review", title: "Review", wipLimit: 3 },
        { id: "done", title: "Done" },
    ],
};

const workflowsSlice = createSlice({
    name: "workflows",
    initialState: { current: defaultWorkflow } as { current: Workflow },
    reducers: {
        setWipLimit(state, action: PayloadAction<{ status: TaskStatus; limit?: number }>) {
            const col = state.current.columns.find((c) => c.id === action.payload.status);
            if (col) col.wipLimit = action.payload.limit;
        },
    },
});

export const { setWipLimit } = workflowsSlice.actions;
export default workflowsSlice.reducer;
