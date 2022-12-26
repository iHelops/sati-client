import {makeAutoObservable} from 'mobx'
import {IMinifiedUser, IUser} from "../types/user";
import api from "../api";

class User {
    constructor() {
        makeAutoObservable(this)
    }

    /*
     * Authorization
     */

    isAuth: boolean = false
    setAuth = (state: boolean) => this.isAuth = state

    /*
     * User
     */

    user = {} as IUser;
    setUserInformation = (data: IUser) => this.user = data

    addSubscription = (user: IMinifiedUser) => {
        this.user.subscriptions = [...this.user.subscriptions, user]
    }

    removeSubscription = (uid: string) => {
        this.user.subscriptions = this.user.subscriptions.filter(item => item.id !== uid)
    }


    /*
     * Actions
     */

    login = (email: string, password: string) => {
        return api.User.auth(email, password).then(res => {
            this.setUserInformation(res.data)
            this.setAuth(true)
        })
    }

    registration = (email: string, name: string, password: string) => {
        return api.User.register(email, name, password).then(res => {
            this.setUserInformation(res.data)
            this.setAuth(true)
        })
    }

    checkSubscribe = (uid: string) => {
        return this.user.subscriptions.filter(item => item.id === uid).length > 0
    }

    subscribe = (uid: string) => {
        return api.User.subscribe(uid).then(res => this.addSubscription(res.data))
    }

    unsubscribe = (uid: string) => {
        return api.User.unsubscribe(uid).then(() => this.removeSubscription(uid))
    }

    logout = () => {
        return api.User.logout().then(() => {
            this.setAuth(false)
        })
    }

    changeAvatar = (file: File) => {
        const formData = new FormData()
        formData.append('file', file)

        return api.User.changeAvatar(formData).then(res => {
            this.setUserInformation({...this.user, avatar: res.data.avatar_id})
        })
    }
}

export default new User()