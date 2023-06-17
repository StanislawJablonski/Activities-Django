import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: {},
    token: "",
  },
  reducers: {
    setUser: (state, userData) => {
      state.user = userData.payload.user
      state.token = userData.payload.token
    },
  },
})

export const { setUser } = userSlice.actions

export default userSlice.reducer