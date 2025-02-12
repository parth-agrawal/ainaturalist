
const INATURALIST_API_TOKEN = process.env.INATURALIST_API_TOKEN;

export const VersToolDescription = `
    Vers is a tool that allows you
    to use a computer to perform any arbitrary action.
    You can describe actions to be taken on a computer in natural language.
    This can include bash commands, or api calls. An example: 

        use the inaturalist api with this token ${INATURALIST_API_TOKEN}
        query the api for some observation data for the most recently observed animals in
        willamsburg, ny.
`;

// consider prompting it to ask a *human* to 
// perform an action instead and see what it comes up with