
export const hypodoxiaMessage = (msg: string) => `[Hypodoxia] ${msg}`;

export const responseErrorMessage = (response: Response) => 
    hypodoxiaMessage(`Response error: ${JSON.stringify(response)}`);

export const fetchErrorMessage = (url: string) =>
    hypodoxiaMessage(`Error fetching or parsing \`${url}\`. \n`);
