'use strict';
angular.module('main')
.service('LoginService', function ($log, $filter, $timeout, $http, $rootScope, Config, UtilService) {
  $log.log('Login.service');
  init();

  var bind = this;

  function init(){
    $log.log('Login.init');
  }

  this.Logout = function (callback, fail) {
    $log.log('init logout...');

    $http({
      method: 'POST',
      data: '{token:"TOKENFAKE"}',
      url: Config.ENV.DOMAIN_BACKEND_URL + '/usuarios/logout'
    })
    .then(function (response) {
      $log.log('logout success!');
      $log.log('logout request:', response.status);
      if (response.status === 200) {
        //set usuario logado
        $rootScope.status = 'Usuário não está logado';
        UtilService.setNotAuthorized();
        UtilService.setUserCurrentBlank();
        UtilService.refreshUserCurrentRoot();
        callback();
      } else {
        fail('Falha no Login: '+response.status+'-'+response.statusText );
      }
      
    }.bind(this))
    .then($timeout(function () {

      $log.log('end logout request...');
    }.bind(this), 6000));
  }

  this.Login = function (usuarioWeb, callback, fail) {
    usuarioWeb.data = castDateForBackend(new Date());
    $log.log('init login:...', usuarioWeb.email);

    $http({
      method: 'POST',
      data: JSON.stringify(usuarioWeb),
      url: Config.ENV.DOMAIN_BACKEND_URL + '/usuarios/login'
    }).then(function successCallback(response) {
      // this callback will be called asynchronously
      // when the response is available
      $log.log('login success!');
      $log.log('login request:', response.status);
      if (response.status === 200) {

        var user = response.data.userCurrent;
        user.data = new Date(user.data);
        //cast date
        UtilService.setUserCurrent(user);
        UtilService.refreshUserCurrentRoot();

        if(user.isAuthorized){
          $log.info('success login!');
          callback();
        } else{
          $log.warn('fail login!');
          fail(response.status);
        }

      } else {
        fail('Falha na requisição. Tente novamente. status:' + response.status);
      }
    }, function errorCallback(response) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
       if(response.status === -1){
         fail('Servidor Indisponível!');
       } else if(response.status === 401){
         $rootScope.status = 'Usuário não autorizado!';
         fail($rootScope.status);
       }else{
         $log.warn('fail login response: ', response);
         fail(response.statusText + ' - ' + response.status);
       }
    });

  }

  this.SignIn = function (usuarioWeb, callback, fail) {
    $log.log('init sign in...', usuarioWeb.email);
    //$rootScope.exames.push(novo);
    $http({
      method: 'POST',
      data: JSON.stringify(usuarioWeb),
      url: Config.ENV.DOMAIN_BACKEND_URL + '/usuarios/signin'
    }).then(function successCallback(response) {
      $log.log('sign success!');
      $log.log('sign request:', response.status);
      if (response.status === 200) {
          $log.info('success sign!');
          callback();
      }else{
        fail(response.statusText);
      }
    }, function errorCallback(response) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.

       if(response.status === 401){
         $rootScope.status = 'Usuário não autorizado!';
         fail($rootScope.status);
       }
       $log.warn('fail sign response: ', $rootScope.status);
    });

  }

  this.LoginEdit = function (usuario, callback, fail) {
      usuario.data = castDateForBackend(usuario.data);
      $log.log('init edit usuario...');
      $http({
        method: 'POST',
        data: JSON.stringify(usuario),
        url: Config.ENV.DOMAIN_BACKEND_URL + '/usuarios'
      }).then(function successCallback(response) {
        // this callback will be called asynchronously
        // when the response is available
        $log.log('get usuario edit success!');
        $log.log('get usuario edit - status:', response.status);
        if (response.status === 200) {
          var user = response.data.userCurrent;
          user.data = new Date(user.data);
          //cast date
          UtilService.setUserCurrent(user);
          UtilService.refreshUserCurrentRoot();
          callback();
        } else {
          fail(response.status +' - '+ response.statusText);
        }
      }, function errorCallback(response) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
         if(response.status === -1){
           fail('Servidor Indisponível!');
         } else if(response.status === 401){
           fail('Usuário não autorizado!');
         }else{
           $log.warn('get usuario one response: ', response);
           fail(response.statusText + ' - ' + response.status);
         }
      });

  }

  function castDateForBackend (data) {
    return $filter('date')(data,"yyyy-MM-dd'T'HH:mm:ssZ");
  }

});
