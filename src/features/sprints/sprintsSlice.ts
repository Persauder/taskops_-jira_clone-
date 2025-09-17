import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Sprint, ID } from "../../types/domain";

type SprintsState = { byId: Record<ID, Sprint>; allIds: ID[] };
const initial: SprintsState = { byId: {}, allIds: [] };

const sprintsSlice = createSlice({
    name: "sprints",
    initialState: initial,
    reducers: {
        seedSprints(state, action: PayloadAction<Sprint[]>) {
            for (const sp of action.payload) {
                state.byId[sp.id] = sp;
                if (!state.allIds.includes(sp.id)) state.allIds.push(sp.id);
            }
        },
    },
});

export const { seedSprints } = sprintsSlice.actions;
export default sprintsSlice.reducer;
