export type Notification = {
    message: string,
}
type NotificationTimeout = {
    timeOutId: NodeJS.Timeout,
    arrayIndex: number
}
export type NotificationObject = Notification & NotificationTimeout;