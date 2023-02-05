import { useState } from "react";
import { ErrorObject, Notification, NotificationObject, ResponseType } from "../types";

const useDisplayNotification = () => {
    const [notification, setNotification] = useState<NotificationObject[]>([]);
    const expiryTime = 5500; //Delete after 5.5 seconds
    const addNotification = (data: Notification) => {
        const theData = { ...data, timeOutId: setTimeout(() => { deleteAfterExpiryTimeNotification(notification.length) }, expiryTime), arrayIndex: notification.length }
        // console.log(theData);
        setNotification([...notification, theData]);
    }
    const deleteAfterExpiryTimeNotification = (arrayIndex: number) => {
        setNotification([
            ...notification.slice(0, arrayIndex),
            ...notification.slice(arrayIndex + 1)
        ]);
    }
    return { notification, addNotification, deleteAfterExpiryTimeNotification }
}
export default useDisplayNotification;