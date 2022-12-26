export const SUBSCRIBER_FORM = ['подписчик', 'подписчика', 'подписчиков']
export const SUBSCRIPTION_FORM = ['подписка', 'подписки', 'подписок']

export function declension(forms: string[], num: number) {
    const cases = [ 2, 0, 1, 1, 1, 2 ];
    return forms[(num % 100 > 4 && num % 100 < 20) ? 2 : cases[(num % 10 < 5) ? num % 10 : 5]];
}