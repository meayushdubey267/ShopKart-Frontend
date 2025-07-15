import { environment } from "src/environments/environment";

export default {
  auth:{
    domain: environment.auth0.domain,
    clientId:environment.auth0.clientId,
    authorizationParams:{
      redirect_uri:environment.auth0.redirectUri,
      audience:environment.auth0.audience
    },
  },
  httpInterceptor:{
    allowedList:environment.auth0.allowedList,
  },
}

