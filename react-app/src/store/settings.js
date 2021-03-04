const initialState = JSON.parse(localStorage.getItem('settings'))

export const UPDATE = "UPDATE";

export const update = settings =>({
    type: UPDATE,
    payload: settings
})

const settings = (state = initialState, action) =>{
    switch(action.type){
        case UPDATE:
            return {...state, ...action.payload}
        default: return state;
    }
}
export default settings;
