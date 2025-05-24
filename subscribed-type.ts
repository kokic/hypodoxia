
namespace Declaration {
    export type SubscribedType = 'static' | 'query';
}

class SubscribedType {

    static readonly STATIC: SubscribedType = new SubscribedType('static');

    static readonly QUERY: SubscribedType = new SubscribedType('query');

    private constructor(private value: Declaration.SubscribedType) { }

    getUrl(link: string, host: string): string {
        return this.value === SubscribedType.STATIC.value
            ? link : this.value === SubscribedType.QUERY.value
                ? `${link}?host=${host}` : link;
    }
}

export default SubscribedType;
