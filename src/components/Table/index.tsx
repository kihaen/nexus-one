'use client'

import { MouseEventHandler, useState, useContext, useEffect } from "react";
import {StoreContext} from '@/components/Customer';
import {ActionTypes} from '@/hooks/createGlobalStore'

type Props = {
    header? : [],
    rows? : [],
    onClick? : MouseEventHandler
}

export const Table = ({header, rows} : Props) : JSX.Element => {
    const[Id, clickId] = useState(0)
    const {State, Dispatch} = useContext(StoreContext);

    const clickHandler = (event : EventTarget)=>{
        clickId(Id + 1);
        Dispatch({type: ActionTypes.Success, payload : { data : {text:'Something'}}})
    }

    useEffect(()=>{
        // console.log(State)
    }, [State])

    return(
        <div>
            <table>
                <thead>
                    <tr>
                        <th onClick={(e)=>{clickHandler(e.target)}}>
                            Id
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            {Id} {rows}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}