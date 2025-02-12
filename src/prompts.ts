
const INATURALIST_API_TOKEN = process.env.INATURALIST_API_TOKEN;

export const VersToolDescription = `
    Vers is a tool that allows you
    to use a computer to perform any arbitrary action.
    You can describe actions to be taken on a computer in natural language.
    This can include bash commands, or api calls. An example: 

        use the inaturalist api with this token ${INATURALIST_API_TOKEN}
        query the api for some observation data for the most recently observed animals in
        willamsburg, ny.

    If any links are included in the response, please include them so the user can follow those 
    links. 
`;

export const VersToolPreprompt = `
    What follows is a request for computer usage that you can process. 
    When the request is for data, please provide the data in as structured of a format as possible, 
    at the end of your process of reasoning provide nothing else except the structured data.
    Prefer JSON structured data. 
`

export const INaturalistPreprompt = `
    If the user is requesting iNaturalist data, return as part of your response any links
    that are included, so that the user can navigate to those links.
`

// consider prompting it to ask a *human* to 
// perform an action instead and see what it comes up with