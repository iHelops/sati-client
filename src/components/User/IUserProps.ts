export interface IUserProps {
    avatarId?: string,
    name: string,
    description: string | number,
    verified?: boolean,
    size?: 'small' | 'large',
    onlyAvatar?: boolean
}