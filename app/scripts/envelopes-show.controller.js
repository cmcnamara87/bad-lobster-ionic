(function () {

    'use strict';
    angular
        .module('banking')
        .controller('EnvelopesShowController', EnvelopesShowController);

    /* @ngInject */
    function EnvelopesShowController($http,
                                     $scope,
                                     ENV,
                                     $stateParams,
                                     $ionicModal) {
        /* jshint validthis: true */
        var vm = this;

        vm.activate = activate;
        vm.title = 'EnvelopesShow';
        vm.showEditEnvelope = showEditEnvelope;
        vm.updateEnvelope = updateEnvelope;
        vm.cancel = cancel;

        activate();

        ////////////////

        function activate() {
            getEnvelope($stateParams.envelopeId);

            $ionicModal.fromTemplateUrl('templates/envelopes-edit.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function(modal) {
                vm.modal = modal;
            });

        }

        function getEnvelope(id) {
            return $http.get(ENV.apiEndpoint + 'envelopes/' + id).then(function(response) {
                vm.envelope = response.data;
            });
        }

        function showEditEnvelope() {
            vm.newEnvelope = angular.copy(vm.envelope);
            vm.modal.show();
        }

        function updateEnvelope(envelope) {
            return $http.put(ENV.apiEndpoint + 'envelopes/' + envelope.id, envelope).then(function(response) {
                getEnvelope(envelope.id);
                vm.modal.hide();
            });
        }

        function cancel() {
            vm.modal.hide();
        }

    }

})();
