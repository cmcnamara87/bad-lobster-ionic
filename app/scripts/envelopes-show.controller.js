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
                                     $ionicModal,
                                     $state) {
        /* jshint validthis: true */
        var vm = this;

        vm.activate = activate;
        vm.title = 'EnvelopesShow';
        vm.showEditEnvelope = showEditEnvelope;
        vm.updateEnvelope = updateEnvelope;
        vm.clearBalance = clearBalance;
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
                var envelope = response.data;
                if(envelope.due_date) {
                    envelope.due_date = new Date(envelope.due_date * 1000);
                }
                vm.envelope = response.data;
            });
        }

        function showEditEnvelope() {
            vm.newEnvelope = angular.copy(vm.envelope);
            vm.modal.show();
        }

        function updateEnvelope(envelope) {
            if(envelope.due_date) {
                envelope.due_date = envelope.due_date.getTime() / 1000;
            }
            return $http.put(ENV.apiEndpoint + 'envelopes/' + envelope.id, envelope).then(function(response) {
                getEnvelope(envelope.id);
                vm.modal.hide();
            });
        }

        function cancel() {
            vm.modal.hide();
        }

        function clearBalance(envelope) {
            return $http.post(ENV.apiEndpoint + 'transfers', {
                'envelope_id': envelope.id
            }).then(function(response) {
                $state.go('tab.envelopes');
            });
        }

    }

})();
