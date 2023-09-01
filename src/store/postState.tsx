import { createSlice } from "@reduxjs/toolkit";

export const postSlice = createSlice({
    name : 'post',
    initialState : {
        data : {
            body: ''
        }
    },
    reducers :{
        resetData : (state) =>{
            state.data = { body : ''}
        },
        setData  :(state, action)=>{
            state.data.body = action.payload
        }
    }
})

export const {resetData, setData} = postSlice.actions
export default postSlice.reducer