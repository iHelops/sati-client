import {makeAutoObservable} from 'mobx'
import {IPost} from "../types/post";
import api from "../api";

class Posts {
    constructor() {
        makeAutoObservable(this)
    }

    posts: IPost[] = []
    setPosts = (posts: IPost[]) => this.posts = posts
    appendPost = (post: IPost) => this.posts.unshift(post)
    removePost = (postId: string) => {
        this.posts = this.posts.filter(item => item.id !== postId)
    }

    loading: boolean = false
    setLoading = (state: boolean) => this.loading = state


    /*
     * Actions
     */

    fetchLast = () => {
        this.setLoading(true)

        api.Post.last().then(res => {
            this.setPosts(res.data)
        }).finally(() => this.setLoading(false))
    }

    fetchUser = (uid: string) => {
        this.setLoading(true)

        api.Post.post(uid).then(res => {
            this.setPosts(res.data)
        }).finally(() => this.setLoading(false))
    }

    like = (id: string) => {
        api.Post.like(id).then(res => {})
    }

    unlike = (id: string) => {
        api.Post.unlike(id).then(res => {})
    }

    create = (content: string, attachments?: string[]) => {
        return api.Post.create(content, attachments).then(res => {
            this.appendPost(res.data)
        })
    }

    remove = (postId: string) => {
        api.Post.delete(postId).then(() => {
            this.removePost(postId)
        })
    }

    adminRemove = (postId: string, userId: string) => {
        api.Admin.postDelete(userId, postId).then(() => {
            this.removePost(postId)
        })
    }
}

export default new Posts()