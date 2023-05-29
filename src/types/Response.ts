export interface dataInterface<T> {
    body: T,
    message: string
    statusCode: number
}
export interface LoginBody {
    token: string
}

export interface FileResponse {
    url: string
}

export interface WhiteBoardCreateBody {
    whiteboardId: string
}

type ErrorTimeout = {
    timeOutId: NodeJS.Timeout,
    arrayIndex: number
}

export interface errorInterface {
    message: string,
    statusCode: number
}

export type ErrorObject<T> = ResponseType<T> & ErrorTimeout

export type ResponseType<T> = {
    success: boolean,
    code: number,
    data: dataInterface<T> | null,
    error: errorInterface | null
}