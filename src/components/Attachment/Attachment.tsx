import React, {FC} from 'react';
import {IAttachmentProps} from "./IAttachmentProps";
import style from './Attachment.module.scss'
import {CloseOutlined, LoadingOutlined} from "@ant-design/icons";
import {Image} from "antd";

const Attachment: FC<IAttachmentProps> = ({status, width='100%', imageUrl, id, onRemove}) => {
    const onRemoveHandler = () => {
        if (onRemove) onRemove(id)
    }

    return (
        <div className={style.attachment} style={{width: width}}>
            <div className={style.remove} onClick={onRemoveHandler}>
                <CloseOutlined />
            </div>
            {status === 'uploading' ? <>
                <div className={style.uploading}>
                    <LoadingOutlined/>
                </div>
            </> : <>
                <div className={style.image}>
                    <Image src={imageUrl} preview={{maskClassName: style.mask}} />
                </div>
            </>}
        </div>
    );
};

export default Attachment;