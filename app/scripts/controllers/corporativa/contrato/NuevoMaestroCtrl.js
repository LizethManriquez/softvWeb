'use strict';

function NuevoMaestroCtrl($uibModal, $rootScope, corporativoFactory, $filter, ngNotify, $state) {
	this.$onInit = function() {
		corporativoFactory.getDistribuidores().then(function(data) {
			vm.distribuidores = data.GetDistribuidoresResult;
		});
		corporativoFactory.getEstados().then(function(data) {
			vm.estados = data.GetMuestraEstadoResult;
		});
		corporativoFactory.getCortes().then(function(data) {
			vm.cortes = data.GetTiposCortesClientesListResult;
		});
		corporativoFactory.getTipoPagos().then(function(data) {
			console.log(data);
			vm.tipoPagos = data.GetTipoPagosFacturasListResult;
		});
	}

	function abrirContratos() {
		var detalle = {};
		detalle.ContratosSoftv = vm.contratos;
		detalle.IdContratoMaestro = vm.contratoMaestro;
		detalle.Action = "ADD";
		if (vm.distribuidor == null) {
			ngNotify.set('Selecciona una distribuidor', 'error');
			return;
		}
		detalle.Distribuidor = vm.distribuidor;


		var modalInstance = $uibModal.open({
			animation: true,
			ariaLabelledBy: 'modal-title',
			ariaDescribedBy: 'modal-body',
			templateUrl: 'views/corporativa/contratosLigados.html',
			controller: 'ContratosLigadosCtrl',
			controllerAs: '$ctrl',
			backdrop: 'static',
			keyboard: false,
			size: "md",
			resolve: {
				detalle: function() {
					return detalle;
				}
			}
		});
	}

	$rootScope.$on('contratos_ligados', function(e, contratos) {
		vm.contratos = contratos
	});

	function cambioEstado() {
		corporativoFactory.getCiudades(vm.estado.Clv_Estado).then(function(data) {
			vm.ciudades = data.GetMuestraCiudadResult;
		});
	}

	function cambioCiudad() {
		corporativoFactory.getLocalidades(vm.ciudad.Clv_Ciudad).then(function(data) {
			vm.localidades = data.GetMuestraLocalidadResult;
		});
	}

	function cambioLocalidad() {
		corporativoFactory.getColonias(vm.localidad.Clv_Localidad).then(function(data) {
			vm.colonias = data.GetMuestraColoniaResult;
		});
	}

	function cambioColonia() {
		corporativoFactory.getCalles(vm.colonia.clv_colonia, vm.localidad.Clv_Localidad).then(function(data) {
			vm.calles = data.GetMuestraCalleResult;
		});
	}

	function guardarContrato() {
		if (vm.prepago == 'prepago') {
			vm.prep = 1;
			vm.posp = 0;
		} else {
			vm.prep = 0;
			vm.posp = 1;
		}
		if (vm.reactivacion == 'manual') {
			vm.reacMan = 1;
			vm.reacPag = 0;
		} else {
			vm.reacMan = 0;
			vm.reacPag = 1;
		}
		if (vm.tipopago == 'estado') {
			vm.pagEdo = 1;
			vm.pagFac = 0;
		} else {
			vm.pagEdo = 0;
			vm.pagFac = 1;
		}
		var auxFecha = $filter('date')(vm.fecha, 'dd/MM/yyyy');
		var contrato = {
			'objContratoMaestroFac': {
				'RazonSocial': vm.razon,
				'NombreComercial': vm.nombrecomercial,
				'Distribuidor': vm.distribuidor.Clv_Plaza,
				'Estado': vm.estado.Clv_Estado,
				'Ciudad': vm.ciudad.Clv_Ciudad,
				'Localidad': vm.localidad.Clv_Localidad,
				'Colonia': vm.colonia.clv_colonia,
				'Calle': vm.calle.Clv_Calle,
				'NumExt': vm.numerointerior,
				'NumInt': vm.numeroexterior,
				'CodigoPostal': vm.cp,
				'RFC': vm.rfc,
				'Prepago': vm.prep,
				'PostPago': vm.posp,
				'DiasCredito': vm.diascredito,
				'DiasGracia': vm.diasgracia,
				'LimiteCredito': vm.limitecredito,
				'FechaFac': auxFecha,
				'PagoEdoCuetna': vm.pagEdo,
				'PagoFac': vm.pagFac,
				'TipoCorteCli': vm.tipocorte.Id,
				'ReactivarMan': vm.reacMan,
				'ReactivarPagoFac': vm.reacPag,
				'TipoPago': vm.formapago.Id,
				'Referencia': vm.Referencia
			}
		};
		corporativoFactory.addMaestro(contrato).then(function(data) {
			vm.contratoMaestro = data.AddContratoMaestroFacResult;
			ngNotify.set('Contrato maestro agregado correctamente, ahora puedes ligar contratos.', 'success');
			vm.ligados = false;
			vm.guardarBtn = true;
			vm.helpSave = true;
		});
	}

	function CambioTipoPago(x) {
		if (x == 'postpago') {
			vm.DesReactiva = false;
			vm.reactivacion = 'manual';

		} else {
			vm.DesReactiva = true;
			vm.reactivacion = 'manual';
		}
	}

	function CambioTipo(x) {

		if (x.Cuenta == true) {
			vm.MuestraReferencia = true;
		} else {
			vm.MuestraReferencia = false;
		}
	}


	var vm = this;
	vm.abrirContratos = abrirContratos;
	vm.contratos = [];
	vm.prepago = 'prepago';
	vm.reactivacion = 'manual';
	vm.tipopago = 'estado';
	vm.guardarContrato = guardarContrato;
	vm.cambioEstado = cambioEstado;
	vm.cambioCiudad = cambioCiudad;
	vm.cambioLocalidad = cambioLocalidad;
	vm.cambioColonia = cambioColonia;
	vm.NumExt = '';
	vm.ligados = true;
	vm.guardarBtn = false;
	vm.helpSave = false;
	vm.CambioTipoPago = CambioTipoPago;
	vm.DesReactiva = true;
	vm.MuestraReferencia = false;
	vm.CambioTipo = CambioTipo;
}
angular.module('softvApp').controller('NuevoMaestroCtrl', NuevoMaestroCtrl);
