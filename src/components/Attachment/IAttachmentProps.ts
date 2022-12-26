export interface IAttachmentProps {
    id: number,
    status: 'uploading' | 'success',
    imageUrl?: string,
    width?: number | string,
    onRemove?: (id: number) => void
}