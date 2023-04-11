import { Table } from '@/components/Table'
import { createContext, useReducer } from 'react';
import reducer, {initialAPIState} from '@/hooks/createGlobalStore'

type Props<T> = {
    data? : T,
};

interface contextType{
    Dispatch : React.Dispatch<any>,
    State : any
}

export const StoreContext = createContext({} as contextType)

export const Customer = <T,>({}: Props<T>): JSX.Element =>{
    const [State, Dispatch] = useReducer(reducer, initialAPIState)

    return(
        <div className='customer_dashboard'>
            <div>
                <h2> This is customer dashboard</h2>
                <p> description about dasboard</p>
            </div>
            <div>
                <article>
                    Possible insert an article?
                </article>
            </div>
            <div>
                Customer is always right
            </div>
            <StoreContext.Provider value={{State, Dispatch} as contextType}>
                <Table />
            </StoreContext.Provider>
        </div>
    )
}