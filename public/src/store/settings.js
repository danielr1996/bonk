const initialState= {
    user: '518222',
    blz: '76050101',
    fintsUrl: 'https://banking-by1.s-fints-pt-by.de/fints30',
    pin: '',
}

export const UPDATE = "UPDATE";

export const update = settings =>({
    type: UPDATE,
    payload: settings
})

export default (state = initialState, action) =>{
    switch(action.type){
        case UPDATE:
            return {...state, ...action.payload}
        default: return state;
    }
}
