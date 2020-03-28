// https://aws-amplify.github.io/docs/js/authentication#manual-setup
export default {
    region: 'us-east-2',
    // url: 'https://ethiopia-covid19.auth.us-east-2.amazoncognito.com/oauth2/token',
    userPoolId: 'us-east-2_AGCA6XBTP',
    userPoolWebClientId: '654eeg4trcap5e105vvtk322ob',
    identityPoolId: 'us-east-2:e2338de4-6c26-464d-a1f8-bea30907b715',
    authenticationFlowType: 'USER_PASSWORD_AUTH'
}

const ref = {
    // REQUIRED only for Federated Authentication - Amazon Cognito Identity Pool ID
    identityPoolId: 'XX-XXXX-X:XXXXXXXX-XXXX-1234-abcd-1234567890ab',
        
    // REQUIRED - Amazon Cognito Region
    region: 'XX-XXXX-X',

    // OPTIONAL - Amazon Cognito Federated Identity Pool Region 
    // Required only if it's different from Amazon Cognito Region
    identityPoolRegion: 'XX-XXXX-X',

    // OPTIONAL - Amazon Cognito User Pool ID
    userPoolId: 'XX-XXXX-X_abcd1234',

    // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
    userPoolWebClientId: 'a1b2c3d4e5f6g7h8i9j0k1l2m3',

    // OPTIONAL - Enforce user authentication prior to accessing AWS resources or not
    mandatorySignIn: false,

    // OPTIONAL - Configuration for cookie storage
    // Note: if the secure flag is set to true, then the cookie transmission requires a secure protocol
    cookieStorage: {
    // REQUIRED - Cookie domain (only required if cookieStorage is provided)
        domain: '.yourdomain.com',
    // OPTIONAL - Cookie path
        path: '/',
    // OPTIONAL - Cookie expiration in days
        expires: 365,
    // OPTIONAL - Cookie secure flag
    // Either true or false, indicating if the cookie transmission requires a secure protocol (https).
        secure: true
    },

    // OPTIONAL - customized storage object
    // storage: new MySt    orage(),
    
    // OPTIONAL - Manually set the authentication flow type. Default is 'USER_SRP_AUTH'
    authenticationFlowType: 'USER_PASSWORD_AUTH',

    // OPTIONAL - Manually set key value pairs that can be passed to Cognito Lambda Triggers
    clientMetadata: { myCustomKey: 'myCustomValue' },

     // OPTIONAL - Hosted UI configuration
    oauth: {
        domain: 'your_cognito_domain',
        scope: ['phone', 'email', 'profile', 'openid', 'aws.cognito.signin.user.admin'],
        redirectSignIn: 'http://localhost:3000/',
        redirectSignOut: 'http://localhost:3000/',
        responseType: 'code' // or 'token', note that REFRESH token will only be generated when the responseType is code
    }
}