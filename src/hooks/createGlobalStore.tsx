
type State = {
    data : any,
    dataFetching : boolean,
    error : string
}

type Action = {
    type : String,
    payload : any
}

export enum ActionTypes {
    Request = "Request",
    Success = "Success",
    Failure = "Failure",
    Invalidate = "Invalidate"
}

export const initialAPIState = {
  data : {},
  dataFetching : false,
  error : ''
}

const reducer = ( state : State, action : Action) : State => {
    const {type} = action;
    switch(type){
      case ActionTypes.Request:
        return{
          ...state,
          dataFetching : true,
          error : ''
        }
      case ActionTypes.Success:
        return{
          ...state,
          data : action.payload.data,
          dataFetching : false,
          error : ''
        }
      case ActionTypes.Failure:
        return{
          ...state,
          dataFetching : false,
          error : action.payload.error
        }
      case ActionTypes.Invalidate:
        return{
          ...state,
          data : {},
          dataFetching : false,
          error : ''
        }
      default:
        return{
          ...state
        }
    }
  
}

export default reducer;