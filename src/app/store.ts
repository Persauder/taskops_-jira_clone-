import { configureStore } from "@reduxjs/toolkit";
import tasksReducer from "../features/tasks/tasksSlice";
import workflowsReducer from "../features/workflows/workflowsSlice";
import sprintsReducer from "../features/sprints/sprintsSlice";

// Якщо додаватимемо RTK Query — сюди ж додамо taskopsApi.reducer і middleware

export const store = configureStore({
    reducer: {
        tasks: tasksReducer,
        workflows: workflowsReducer,
        sprints: sprintsReducer,
    },
    // дефолтний middleware ок; як з’явиться RTK Query — додамо .concat(taskopsApi.middleware)
    devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
