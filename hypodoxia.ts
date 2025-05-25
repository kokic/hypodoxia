
import { fetchHypodoxia, HypodoxiaMatcher, matchHypodoxiaJson } from "./fetch-comments";
import SubscribedType from "./subscribed-type";

export type Subscribed = {
    name: string;
    link: string;
    type?: SubscribedType | undefined;
};

export type Comment = {
    name: string;
    text: string;
};

class Hypodoxia {

    private loaded: boolean = false;

    private comments: Comment[] = [];

    constructor(private list: Subscribed[]) { }

    async loadCommentsOnce(
        matcher: HypodoxiaMatcher = matchHypodoxiaJson,
        href: string = document.location.href,
    ): Promise<Comment[]> {
        if (this.loaded === true) {
            return this.comments;
        }

        for (const { name, link, type } of this.list) {
            const associated = (await fetchHypodoxia(link, href, matcher, type))
                .map((text: string) => ({ name, text } as Comment));
            this.comments.push(...associated);
        }

        this.loaded = true;

        return this.comments;
    }

    async defaultView(
        titleText: (n: number) => string = View.defaultTitleText,
    ): Promise<HTMLElement> {
        return await View.toElement(this, titleText);
    }

    async appendTo(div: HTMLElement): Promise<void> {
        document.addEventListener("DOMContentLoaded", async () =>
            div.appendChild(await this.defaultView()));
    }
};

export namespace View {

    export const defaultTitleText = (n: number) => `${n} 条评论`;

    export async function toElement(
        self: Hypodoxia,
        titleText: (n: number) => string = defaultTitleText,
    ): Promise<HTMLElement> {
        const comments = await self.loadCommentsOnce();

        const container = document.createElement('div');
        Object.assign(container.style, Styles.container);

        const title = document.createElement('h2');
        title.textContent = titleText(comments.length);
        Object.assign(title.style, Styles.title);
        container.appendChild(title);

        comments.forEach(comment => {
            const commentDiv = document.createElement('div');
            Object.assign(commentDiv.style, Styles.comment);

            const nameElement = document.createElement('div');
            nameElement.textContent = comment.name;
            Object.assign(nameElement.style, Styles.name);

            const textElement = document.createElement('p');
            textElement.textContent = comment.text;
            Object.assign(textElement.style, Styles.text);

            commentDiv.appendChild(nameElement);
            commentDiv.appendChild(textElement);
            container.appendChild(commentDiv);
        });

        return container;
    }
};

namespace Styles {

    export const container: Partial<CSSStyleDeclaration> = {
        margin: '0 auto',
        padding: '20px',
    };

    export const title: Partial<CSSStyleDeclaration> = {
        fontSize: '20px',
        margin: '0 0 1em 0',
    };

    export const comment: Partial<CSSStyleDeclaration> = {
        padding: '0.5em 1em',
        marginTop: '0.5em',
        marginBottom: '0.5em',
    };

    export const name: Partial<CSSStyleDeclaration> = {
        fontWeight: 'bold',
        marginBottom: '8px'
    };

    export const text: Partial<CSSStyleDeclaration> = {
        lineHeight: '1.5'
    };

};

export default Hypodoxia;
