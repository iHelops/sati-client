import React, {createRef, FC, useState} from 'react';
import {IPostWriteProps} from "./IPostWriteProps";
import style from './PostWrite.module.scss'
import {Button, Card, Input, message} from "antd";
import {PaperClipOutlined} from "@ant-design/icons";
import {IAttachment} from "./IAttachment";
import api from "../../api";
import {checkFileExtension} from "../../utils/file";
import Attachment from "../Attachment/Attachment";
import posts from "../../store/posts";

const { TextArea } = Input;

const PostWrite: FC<IPostWriteProps> = ({extensions}) => {
    const [content, setContent] = useState<string>('')
    const [drag, setDrag] = useState<boolean>(false)
    const [dragHeight, setDragHeight] = useState<number>(0)
    const [attachments, setAttachments] = useState<IAttachment[]>([])
    const contentRef = createRef<HTMLDivElement>()
    const [messageApi, contextHolder] = message.useMessage();
    const [postCreating, setPostCreating] = useState<boolean>(false)

    const onWrite = (value: string) => setContent(value)

    const uploadAttachment = (file: File) => {
        if (!checkFileExtension(file, extensions)) {
            messageApi.error(`Файл ${file.name} не может быть загружен.`)
            return
        }

        const fileId: number = attachments.length > 0 ? attachments[attachments.length - 1].id + 1 : 0
        const attachment: IAttachment = {
            id: fileId,
            status: 'uploading'
        }
        setAttachments(prev => [...prev, attachment])

        const formData = new FormData()
        formData.append('file', file)

        api.File.uploadImage(formData).then(res => {
            setAttachments(prev => prev.map(item => {
                if (item.id === fileId) {
                    const newItem: IAttachment = {
                        id: item.id,
                        status: 'success',
                        hash: res.data.file_id
                    }
                    return newItem
                }
                return item
            }))
        })
    }

    const onRemoveAttachment = (id: number) => {
        setAttachments(prev => prev.filter(item => item.id !== id))
    }

    const onCreate = () => {
        setPostCreating(true)

        const att: string[] = []
        attachments.forEach(item => {
            if (item.hash) att.push(item.hash)
        })
        posts.create(content, att).finally(() => setPostCreating(false))

        setContent('')
        setAttachments([])
    }

    const onDragStart = (e: any) => {
        e.preventDefault()
        if (contentRef.current) setDragHeight(contentRef.current.getBoundingClientRect().height)
        setDrag(true)
    }

    const onDragLeave = (e: any) => {
        e.preventDefault()
        setDrag(false)
    }

    const onDrop = (e: any) => {
        e.preventDefault()
        setDrag(false)

        const files = [...e.dataTransfer.files]
        files.forEach(file => uploadAttachment(file))
    }

    return (
        <div className={style.writer}>
            {contextHolder}
            <Card size='small'>
                {drag ? <>
                    <div
                        className={style.drag}
                        style={{height: dragHeight}}
                        onDragLeave={e => onDragLeave(e)}
                        onDragOver={e => onDragStart(e)}
                        onDrop={e => onDrop(e)}
                    >
                        <PaperClipOutlined />
                    </div>
                </> : <>
                    <div
                        ref={contentRef}
                        onDragOver={e => onDragStart(e)}
                    >
                        <TextArea autoSize maxLength={5000} showCount value={content} onChange={e => onWrite(e.target.value)} className={style.text}/>
                        {attachments.length > 0 ? <>
                            <div className={style.attachments}>
                                {attachments.map(item => (
                                    <Attachment
                                        key={item.id}
                                        id={item.id}
                                        status={item.status}
                                        imageUrl={item.hash ? api.File.get(item.hash) : undefined}
                                        width='calc(20% - 5px)'
                                        onRemove={onRemoveAttachment}
                                    />
                                ))}
                            </div>
                        </> : <></>}
                        <div className={style.actions}>
                            <Button type='text' icon={<PaperClipOutlined />}></Button>
                            <Button type='primary' disabled={!content.trim()} loading={postCreating} onClick={onCreate}>Опубликовать</Button>
                        </div>
                    </div>
                </>}
            </Card>
        </div>
    );
};

export default PostWrite;