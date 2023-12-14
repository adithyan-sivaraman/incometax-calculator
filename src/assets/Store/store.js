import { createSlice, configureStore } from "@reduxjs/toolkit";
const heads = JSON.parse(localStorage.getItem('heads'));
const DataSlice = createSlice({
    name: "data",
    initialState: {
        salary: '',
        house: '',
        business: '',
        others: '',
        capgain: false,
        deduction:'',
        hracalc: false,
        formVisible: {
            salary: false,
            house: false,
            business: false,
            other: false,
            capgain: false,
            info:false,
            deduction: false,
        },
        userInfo:true,
        selectedHeads:heads?heads:[false,false,false,false,false,true]
    },
    reducers: {
        setSalary: (state, action) => {
            state.salary = action.payload
        },
        setHouse: (state, action) => {
            state.house = action.payload
        },
        setBusiness: (state, action) => {
            state.business = action.payload
        }, setOthers: (state, action) => {
            state.others = action.payload
        }
        , setCapGain: (state, action) => {
            state.capgain = action.payload
        },
        setHraCalc: (state, action) => {
            state.hracalc = action.payload
        },
        setFormVisible: (state, action) => {
            state.formVisible = action.payload
        },
        setUserInfo:(state,action)=>{
            state.userInfo = action.payload
        },
        setDeduction:(state,action)=>{
            state.deduction = action.payload
        },
        setHeads:(state,action)=>{
            state.selectedHeads = action.payload;
        }
    }
})

export const { setSalary, setHouse, setCapGain, setOthers, setBusiness, setHraCalc, setFormVisible,setUserInfo,setDeduction,setHeads } = DataSlice.actions;

const store = configureStore({
    reducer: {
        data: DataSlice.reducer
    }
})

export default store;