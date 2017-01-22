/*jslint evil: true, regexp: false */
'use strict';

angular.module('ChimpChangeAuthentication', ['ngCookies'])
    .constant('Constant', {
        PREFIX: 'https://authentication-api-test.chimpchange.me/authentication',
        IP_ADR_URL: 'https://api.ipify.org?format=jsonp&callback=',
        USER: '/credentials',
        LOGOUT: '/logout',
        RESEND: '/resendCode',
        RESET: '/resetPassword',
        SECURITY: '/securityProfile',
        TWO_FACTOR: '/twoFactor',

        USER_ACCOUNT_TOKENS: 'tokens',
        USER_ACCOUNT_INFO: 'userAccount'
    })
    .factory('authentication', function ($http, Constant, $q, $cookies) {
        return {
            authenticateByCredentials: function (data) {
                var temp = {
                    deviceId: $cookies.getObject('deviceId') || angular.noop(),
                    pin: ''
                }, defer = $q.defer();
                data = angular.merge(temp, data);
                $http.post(Constant.PREFIX, data).then(function (response) {
                    var res = {
                        data: response.data,
                        headers: response.headers,
                        status: response.status,
                        statusText: response.statusText,
                        config: response.config
                    }, tokens = {
                        deviceToken: response.data.deviceToken,
                        token: response.data.token
                    };
                    $cookies.putObject(Constant.USER_ACCOUNT_TOKENS, tokens);
                    $cookies.putObject(Constant.USER_ACCOUNT_INFO, response.data);
                    defer.resolve(res);
                }, function (response) {
                    defer.reject(response);
                });
                return defer.promise;
            },
            createUser: function (data) {
                return $http.post(Constant.PREFIX + Constant.USER, data);
            },
            getUserDetails: function (userId) {
                return $http.get(Constant.PREFIX + Constant.USER + '/' + userId);
            },
            updateUserDetail: function (userId, data) {
                return $http.put(Constant.PREFIX + Constant.USER + '/' + userId, data);
            },
            logout: function (data) {
                return $http.post(Constant.PREFIX + Constant.LOGOUT, data);
            },
            resendCode: function () {
                var data = $cookies.getObject(
                    Constant.USER_ACCOUNT_INFO
                ).userId;
                return $http.post(Constant.PREFIX + Constant.RESEND + '?userId=' + data);
            },
            reset: function (data) {
                return $http.post(Constant.PREFIX + Constant.RESET, data);
            },
            getSecurityProfile: function (userId) {
                return $http.get(Constant.PREFIX + Constant.SECURITY + '/' + userId, {
                    headers: {

                        "Accept": "application/json"

                    }
                });
            },
            updateSecurityProfile: function (userId, data) {
                return $http.put(Constant.PREFIX + Constant.SECURITY + '/' + userId, data);
            },
            twoFactor: function (data) {
                var postData = {
                    userId: $cookies.getObject(
                        Constant.USER_ACCOUNT_INFO
                    ).userId,
                    code: data.code
                };
                return $http.post(Constant.PREFIX + Constant.TWO_FACTOR, postData);
            }

        };
    })
    .factory('authenticationInterceptor', function (Constant, $cookies, SDKCache) {
        return {
            request: function (config) {
                var deviceID, ipAdr, userToken = $cookies.getObject('tokens') || angular.noop();
                if (config.url !== Constant.IP_ADR_URL && config.url.indexOf('authentication') > -1) {
                    ipAdr = SDKCache.getIP();
                    deviceID = $cookies.getObject('deviceId') || angular.noop();
                    config.headers['Content-Type'] = 'application/json';
                    config.headers.client = 'web';
                    config.headers['X-Client-IP'] = ipAdr;
                    if (config.url.indexOf('/authentication/resetPassword') > -1) {
                        config.headers.deviceId = deviceID;
                    }
                    if (userToken) {
                        config.headers.token = userToken.token;
                        config.headers.deviceId = deviceID;
                    }
                } else if (config.url === Constant.IP_ADR_URL) {
                    config.headers.token = undefined;
                } else {
                    if (userToken) {
                        config.headers.token = userToken.token;
                    }
                }

                return config;
            }
        };
    })
    .config(function ($httpProvider) {
        $httpProvider.interceptors.push('authenticationInterceptor');
    })
    .factory('SDKCache', function ($cacheFactory, $cookies) {
        var cacheObject = $cacheFactory('cacheManager'),
            ip = 'ipAdr';

        // Public API here
        return {
            setIP: function (data) {
                $cookies.putObject('client-ip', data);
                return cacheObject.put(ip, data);
            },
            getIP: function () {
                return cacheObject.get(ip);
            }
        };
    }).factory('DeviceID', function ($cookies) {
        var deviceID = '', possible, i;
        return {
            SetDeviceID: function () {
                deviceID = $cookies.getObject('deviceId') || angular.noop();
                if (!deviceID) {
                    possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

                    for (i = 0; i < 14; i++) {
                        deviceID += possible.charAt(Math.floor(Math.random() * possible.length));
                    }
                }
                $cookies.putObject('deviceId', deviceID);
            }
        };
    })
    .run(['$http', 'SDKCache', 'DeviceID', function ($http, SDKCache, DeviceID) {
        DeviceID.SetDeviceID();
        if (!SDKCache.getIP()) {
            $http.get('https://api.ipify.org?format=jsonp&callback=',
                {
                    headers: {
                        'Content-Type': 'application/javascript',
                        client: undefined,
                        'X-Client-IP': undefined,
                        token: undefined
                    }
                })
                .then(function (res) {
                    var str = res.data;
                    str = eval(str);// jshint ignore:line
                    SDKCache.setIP(str.ip);
                });
        }
    }]);
