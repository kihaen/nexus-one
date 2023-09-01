import { configureStore } from '@reduxjs/toolkit'
import post from './postState'

const store = configureStore({
  reducer: {
    post
  }
})

export default store;
export type RootState = ReturnType<typeof store.getState>