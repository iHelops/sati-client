export interface IAttachment {
    id: number,
    status: 'uploading' | 'success',
    hash?: string
}