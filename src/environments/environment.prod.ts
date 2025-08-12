export const environment = {
    cognito: {
        userPoolId: 'eu-xxxxxx_example',
        userPoolClientId: 'exampleclientidxxxxxxxxxxxx',
        region: 'eu-xxxxxx',
        loginWith: {
            oauth: {
                domain: 'your-domain.auth.eu-xxxxxx.amazoncognito.com',
                scopes: ['openid', 'email', 'profile'],
                redirectSignIn: ['https://your-production-domain/'],
                redirectSignOut: ['https://your-production-domain/'],
                responseType: 'code' as const,
            },
        },
    },
};
