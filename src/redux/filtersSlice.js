const { createSlice } = require("@reduxjs/toolkit");

const initialState = { value: '' }

const filterSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    addFilters(state, action) {
      state.value = action.payload
    }
  }
});

export const filtersReducer = filterSlice.reducer;

export const { addFilters } = filterSlice.actions;


export const getFilters = state => state.filters.value;
