export const environment = {
    cognito: {
        userPoolId: 'ap-south-1_BemFzaJHA',
        userPoolClientId: '2n97u3c8kj3fngbvu1u63cc',
        region: 'eu',
        loginWith: {
            oauth: {
                domain: 'your-domain.auth.eu-xxxxxx.amazoncognito.com',
                scopes: ['openid', 'email', 'profile'],
                redirectSignIn: ['http://localhost:4200/'],
                redirectSignOut: ['http://localhost:4200/'],
                responseType: 'code' as const,
            },
        },
    },
};
