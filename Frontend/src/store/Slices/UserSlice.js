import { createSlice } from "@reduxjs/toolkit";

const userinitialstate = {
  user: null,
  isLoaing: true,
};
export const UserSlice = createSlice({
  name: "user",
  initialState: userinitialstate,

  reducers: {
    //state = initial state
    setUser: (state, action) => {
      state.user = action.payload;
      state.isLoaing = false;
    },
  },
});

export const { setUser } = UserSlice.actions;
export default UserSlice.reducer;
