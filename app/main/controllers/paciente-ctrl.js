'use strict';
angular.module('main')
.controller('PacienteCtrl', function ($log, $state, $stateParams, Main, FlashService) {

  $log.log('Hello from your Controller: PacienteCtrl in module main:. This is your controller:', this);
  var bind = this;
  bind.novo = $stateParams.pacienteId? Main.getPaciente($stateParams.pacienteId) : null;

  bind.add = function () {
  	FlashService.Question('Incluir novo registro?', msgSucesso);
  	Main.addPaciente(bind.novo);
  }
  bind.edit = function () {
    FlashService.Question('Alterar dados do registro?', function () {
      if (Main.editPaciente(bind.novo)) {
        msgSucesso();
      } else {
        msgErro();
      }
    });
  }
  function msgErro() {
    FlashService.Error('Não foi possivel editar o registro...');
  }
  function msgSucesso() {
  	FlashService.Success('Operação realizada com sucesso');
  	$state.go('main.pacientes');
  }
  bind.mock = function () {
  	var dataRandon = new Date();
    dataRandon.setDate(dataRandon.getDate() + Math.random() * 3 + 1);
  	var novo =  {
  		'nome':'Jonny Bigood',
  		'responsavel': 'Cristofer Yellow',
  		'dataNascimento': dataRandon,
  		'sexo':'Masculino',
  		'estadoCivil':'Solteiro',
  		'naturalidade':'Taguatinga - TO',
  		'profissao': 'Engenheiro'
  	};
  	bind.novo = novo;
  }

});
