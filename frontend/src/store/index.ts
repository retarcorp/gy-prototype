import { configureStore, combineReducers } from '@reduxjs/toolkit'
import userSlice from './user'
import userEventsSlice from './userEvents'
import adminEventsSlice from './adminEvents'
import adminGameSlice from './adminGame'

const store = configureStore({
  reducer: combineReducers({
    user: userSlice.reducer, 
    userEvents: userEventsSlice.reducer,
    adminEvents: adminEventsSlice.reducer,
    adminGame: adminGameSlice.reducer,
  }),
})

export default store;