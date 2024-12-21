export type valueOf<T> = T[keyof T];

export declare type Result<T> = {
    value: T,
    status: 'Ok' | 'Error'
}