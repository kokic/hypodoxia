
import { responseErrorMessage, fetchErrorMessage } from "./log-message";
import Subscribed from "./subscribed-type";

export type HypodoxiaMatcher = (text: string, href: string) => string[];

export async function fetchHypodoxia(
    link: string,
    href: string = link,
    matcher: HypodoxiaMatcher = matchHypodoxiaJson,
    subscribed: Subscribed = Subscribed.STATIC,
): Promise<string[]> {
    const url = subscribed.getUrl(link, href);
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(responseErrorMessage(response));
        }
        return matcher(await response.text(), href);
    } catch (error) {
        console.error(fetchErrorMessage(url), error);
        return [];
    }
}

export function matchHypodoxiaJson(json: string, href: string): string[] {
    const comments = JSON.parse(json);
    return comments
        .filter((comment: { href: string }) => comment.href === href)
        .map((comment: { text: string }) => comment.text);
}
