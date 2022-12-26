import axios from 'axios'
import {IMinifiedUser, IUser} from "../types/user";
import {IPost} from "../types/post";
import {IComment} from "../types/comments";
import {IAvatar, IFile} from "../types/file";

const API_URL = 'http://127.0.0.1:5000/api'

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true
})

const request = {
    get: <T>(url: string) => api.get<T>(url),
    post: <T>(url: string, data?: object) => api.post<T>(url, data),
    delete: <T>(url: string, data?: object) => api.delete<T>(url, {data: data})
}

const User = {
    register: (email: string, name: string, password: string) => request.post<IUser>('/user/register', {
        email: email,
        name: name,
        password: password
    }),
    auth: (email: string, password: string) => request.post<IUser>('/user/auth', {
        email: email,
        password: password
    }),
    check: () => request.get<IUser>('/user/check'),
    user: (id: string) => request.get<IUser>('/user/' + id),
    subscribe: (id: string) => request.post<IMinifiedUser>('/user/subscribe', {
        user_id: id
    }),
    unsubscribe: (id: string) => request.post('/user/unsubscribe', {
        user_id: id
    }),
    logout: () => request.post('/user/logout'),
    search: (query: string) => request.post<IMinifiedUser[]>('/user/search', {
        query: query
    }),
    changeAvatar: (formData: FormData) => request.post<IAvatar>('/user/change-avatar', formData)
}

const Post = {
    last: () => request.get<IPost[]>('/post/last'),
    like: (id: string) => request.post('/post/like', {
        post_id: id
    }),
    unlike: (id: string) => request.post('/post/unlike', {
        post_id: id
    }),
    post: (id: string) => request.get<IPost[]>('/post/' + id),
    create: (content: string, attachments?: string[]) => request.post<IPost>('/post/create', {
        content: content,
        attachments: attachments ? attachments : []
    }),
    delete: (postId: string) => request.delete('/post/delete', {
        post_id: postId
    })
}

const File = {
    get: (id: string) => API_URL + '/file/' + id,
    uploadImage: (formData: FormData) => request.post<IFile>('/file/upload-image', formData)
}

const Comments = {
    get: (post_id: string) => request.get<IComment[]>('/comment/' + post_id),
    create: (post_id: string, content: string) => request.post<IComment>('/comment/create', {
        post_id: post_id,
        content: content
    })
}

const Admin = {
    postDelete: (userId: string, postId: string) => request.delete('/admin/post/delete', {
        post_id: postId,
        user_id: userId
    })
}

const exportedObjects = {
    User,
    Post,
    File,
    Comments,
    Admin
}

export default exportedObjects