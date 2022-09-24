export enum TransactionType{
    OpenPosition,
    ClosePosition,
    StableSwap,
    Approve
}

export enum TransactionStatus{
    None,
    Success,
    Error,
}

export interface ITransaction{
    hash:string
    type:TransactionType
    active:boolean
    status:TransactionStatus
    title:string
    message:string
}