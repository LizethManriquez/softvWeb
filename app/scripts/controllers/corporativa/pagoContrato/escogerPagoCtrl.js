'use strict';
angular.module('softvApp').controller('EscogerPagoCtrl', EscogerPagoCtrl);

function EscogerPagoCtrl($uibModal, $state, $rootScope, cajasFactory, ngNotify, inMenu, $uibModalInstance, items, metodo) {

    function cambio(pago) {
		if (pago == 1){
			vm.fijos = true;
			vm.variables = false;
			vm.botonFijo = true;
			vm.botonVariable = false;
		}
		else if (pago == 2){
			vm.fijos = false;
			vm.variables = true;
			vm.botonFijo = false;
			vm.botonVariable = true;
		}
	}
	
	function guardarFijo() {
		var objPagar = {
			"ClvFacturaMaestro": vm.clvFactura,
			"NoPago": vm.numeroPagos,
			"PagoInicial": vm.pagoInicial
		};
		$uibModalInstance.dismiss('cancel');
		vm.animationsEnabled = true;
		var modalInstance = $uibModal.open({
			animation: vm.animationsEnabled,
			ariaLabelledBy: 'modal-title',
			ariaDescribedBy: 'modal-body',
			templateUrl: 'views/corporativa/pagarCredito.html',
			controller: 'PagarCreditoCtrl',
			controllerAs: '$ctrl',
			backdrop: 'static',
			keyboard: false,
			size: 'md',
			resolve: {
				items: function() {
					return items;
				},
				metodo: function() {
					return metodo;
				}
			}
		});
	}

    function cancel() {
		$uibModalInstance.dismiss('cancel');
	}

    var vm = this;
    vm.cambio = cambio;
	vm.guardarFijo = guardarFijo;
    vm.cancel = cancel;
	vm.monto = items.Monto;
}
