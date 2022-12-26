import {makeAutoObservable} from 'mobx'
import api from "../api";
import {IComment} from "../types/comments";

class Comments {
    constructor() {
        makeAutoObservable(this)
    }

    comments: IComment[] = []
    setComments = (comments: IComment[]) => this.comments = comments

    loading: boolean = false
    setLoading = (state: boolean) => this.loading = state


    /*
     * Actions
     */

    fetchComments = (id: string) => {
        this.setLoading(true)

        api.Comments.get(id).then(res => {
            this.setComments(res.data)
        }).finally(() => this.setLoading(false))
    }

    createComment = (postId: string, text: string) => {
        return api.Comments.create(postId, text).then(res => {
            this.setComments([...this.comments, res.data])
        })
    }
}

export default new Comments()