import { useState } from "react";
import { ErrorObject, ResponseType } from "../types";

const useDisplayError = () => {
    const [error, setError] = useState<ErrorObject<any>[]>([]);
    const expiryTime = 5500; //Delete after 5.5 seconds
    const addError = (data: ResponseType<any>) => {
        const theData = { ...data, timeOutId: setTimeout(() => { deleteAfterExpiryTime(error.length) }, expiryTime), arrayIndex: error.length }
        // console.log(theData);
        setError([...error, theData]);
    }
    const deleteAfterExpiryTime = (arrayIndex: number) => {
        setError([
            ...error.slice(0, arrayIndex),
            ...error.slice(arrayIndex + 1)
        ]);
    }
    return { error, addError, deleteAfterExpiryTime }
}
export default useDisplayError;