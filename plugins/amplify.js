import Vue from 'vue'
import Amplify, * as AmplifyModules from 'aws-amplify'
import { AmplifyPlugin } from 'aws-amplify-vue'
import awsAuthConfig from './aws-auth-config'

Amplify.configure({
    Auth: awsAuthConfig
})


Vue.use(AmplifyPlugin, AmplifyModules);