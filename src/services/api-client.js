import axios from 'axios';
import storage from '../storage';
import Endpoint from '../services/endpoints';
import Utils from '../commons/utils';
if (__DEV__) {
  // for show log in network tab
  // eslint-disable-next-line no-undef
  GLOBAL.XMLHttpRequest =
    // eslint-disable-next-line no-undef
    GLOBAL.originalXMLHttpRequest || GLOBAL.XMLHttpRequest;
}

export default class ApiClient {
  constructor({
    baseURL,
    logOutput = true,
    pathPrefix = '',
    onTokenExpired,
    onRefreshTokenFailed,
  }) {
    this.instance = axios.create({
      baseURL,
      timeout: 30000,
    });

    if (logOutput) {
      this.instance.interceptors.request.use(request => {
        console.log('Api request: ', request);
        return request;
      });

      this.instance.interceptors.response.use(
        response => {
          console.log('Api response: ', response);
          return response;
        },
        error => {
          console.log('response - error', JSON.stringify(error));
        },
      );
    }
    this.pathPrefix = pathPrefix || '';
    this.onTokenExpired = onTokenExpired;
    this.onRefreshTokenFailed = onRefreshTokenFailed;
    this.refreshTokenRequest = null;
    this.isExpiredToken = false;
    this.isRefreshExpiredTokenFailed = false;
  }

  refreshAccessToken = async () => {
    const headers = { 'Content-Type': 'application/json' };
    return this.instance
      .request({
        method: 'POST',
        url: this.pathPrefix + Endpoint.refreshExpiredToken,
        data: {
          refresh_token: storage.user.refresh_token,
        },
        headers,
      })
      .then(response => {
        this.isRefreshExpiredTokenFailed = !Utils.isResponseSuccess(response);
        if (this.isRefreshExpiredTokenFailed) {
          // refresh token failed
          if (this.onRefreshTokenFailed) {
            this.onRefreshTokenFailed();
          }
        }
        return response;
      })
      .catch(error => {
        this.isRefreshExpiredTokenFailed = true;
        return error;
      });
  };

  request = async (
    method,
    path,
    requestHeaders,
    params = null,
    data = null,
    authenticate = false,
    isFormData = false,
    onUploadProgress = null,
  ) => {
    const headers = requestHeaders || {};
    let token = '';
    if (authenticate) {
      if (this.isRefreshExpiredTokenFailed) {
        return Promise.reject(Error('Refresh token failed'));
      }
      if (this.isExpiredToken) {
        console.log('requestApi: Ooops ... token expired: ');
        const newTokenRsp = await this.refreshTokenRequest;
        if (Utils.isResponseSuccess(newTokenRsp)) {
          token = newTokenRsp.data.token;
          await storage.saveUser({
            token: newTokenRsp.data.token,
          });
        } else {
          // refresh token failed
          if (this.onRefreshTokenFailed) {
            this.onRefreshTokenFailed();
          }
        }
        // reset token request for the next expiration
        this.refreshTokenRequest = null;
        this.isExpiredToken = false;
      }
    }
    if (authenticate || storage.user) {
      headers.Authorization = `Bearer ${token || storage.user.token}`;
    }
    return this.instance
      .request({
        method,
        url: this.pathPrefix + path,
        params: Utils.removeEmptyAttributes(params),
        data: isFormData ? data : Utils.removeEmptyAttributes(data),
        headers,
        onUploadProgress,
      })
      .then(async response => {
        if (
          Utils.isResponseExpiredToken(response) &&
          !this.isRefreshExpiredTokenFailed
        ) {
          if (this.onTokenExpired) {
            this.onTokenExpired();
          }
          this.isExpiredToken = true;
          this.refreshTokenRequest = this.refreshAccessToken();

          const newTokenRsp = await this.refreshTokenRequest;
          // reset token request for the next expiration
          this.refreshTokenRequest = null;
          this.isExpiredToken = false;
          if (Utils.isResponseSuccess(newTokenRsp)) {
            token = newTokenRsp.data.token;
            await storage.saveUser({
              token: newTokenRsp.data.token,
            });
            // retry current request
            return await this.request(
              method,
              path,
              requestHeaders,
              params,
              data,
              authenticate,
              isFormData,
              onUploadProgress,
            );
          }
        } else if (Utils.isResponseSuccess(response)) {
          if (
            [
              Endpoint.login,
              Endpoint.loginApple,
              Endpoint.loginFB,
              Endpoint.loginGoogle,
            ].includes(path)
          ) {
            // reset token request for the next expiration
            this.refreshTokenRequest = null;
            this.isExpiredToken = false;
            this.isRefreshExpiredTokenFailed = false;
          }
        }
        return response;
      });
  };

  get = async (
    path,
    params = null,
    authenticate = false,
    requestHeaders = null,
  ) => {
    let headers = requestHeaders || {};
    headers = { 'Content-Type': 'application/json', ...headers };
    return this.request('GET', path, headers, params, null, authenticate);
  };

  post = async (
    path,
    data = null,
    authenticate = false,
    requestHeaders = null,
  ) => {
    let headers = requestHeaders || {};
    headers = { 'Content-Type': 'application/json', ...headers };
    return this.request('POST', path, headers, null, data, authenticate);
  };

  postFormData = async (
    path,
    data = null,
    authenticate = false,
    requestHeaders = null,
    onUploadProgress = null,
  ) => {
    let headers = requestHeaders || {};
    headers = { 'Content-Type': 'multipart/form-data', ...headers };
    console.log(storage.user.token);
    return this.request(
      'POST',
      path,
      headers,
      null,
      data,
      authenticate,
      true,
      onUploadProgress,
    );
  };

  put = async (
    path,
    data = null,
    authenticate = false,
    requestHeaders = null,
  ) => {
    let headers = requestHeaders || {};
    headers = { 'Content-Type': 'application/json', ...headers };
    return this.request('PUT', path, headers, null, data, authenticate);
  };

  delete = async (
    path,
    data = null,
    authenticate = false,
    requestHeaders = null,
  ) => {
    let headers = requestHeaders || {};
    headers = { 'Content-Type': 'application/json', ...headers };
    return this.request('DELETE', path, headers, null, data, authenticate);
  };
}
