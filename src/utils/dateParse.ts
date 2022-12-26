export function dateParse(date: string) {
    const months = ['янв','фев','мар','апр','мая','июня','июля','авг','сен','окт','ноя','дек']

    const timestamp = Date.parse(date)
    const newDate = new Date(timestamp)

    return `${newDate.getDate()} ${months[newDate.getMonth()]} ${newDate.getFullYear()}`
}