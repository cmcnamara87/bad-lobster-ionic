(function () {

    'use strict';
    angular
        .module('banking')
        .controller('EnvelopesController', EnvelopesController);

    /* @ngInject */
    function EnvelopesController($http,
                                 ENV,
                                 $scope,
                                 $ionicModal,
                                 $state) {
        /* jshint validthis: true */
        var vm = this;

        vm.activate = activate;
        vm.title = 'Envelopes';
        vm.doRefresh = doRefresh;
        vm.showCreateEnvelope = showCreateEnvelope;
        vm.createEnvelope = createEnvelope;
        vm.showEnvelope = showEnvelope;
        vm.hasDueDate = true;
        vm.cancel = cancel;
        vm.getEnvelopeColor = getEnvelopeColor;

        $ionicModal.fromTemplateUrl('templates/envelopes-create.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            vm.modal = modal;
        });

        activate();

        $scope.$on('$ionicView.enter', function(e) {
            activate();
        });

        ////////////////

        function activate() {
            getEnvelopes();
            getMe();
        }

        function getMe() {
            return $http.get(ENV.apiEndpoint + 'me').then(function(response) {
                vm.me = response.data;
            });
        }

        function getEnvelopes() {
            return $http.get(ENV.apiEndpoint + 'envelopes').then(function(response) {
                vm.envelopes = response.data.data;
            });
        }

        function doRefresh() {
            getEnvelopes().then(function() {
                $scope.$broadcast('scroll.refreshComplete');
            });
        }

        function showCreateEnvelope() {
            vm.newEnvelope = {};
            vm.newMeta = {};
            vm.modal.show();
        }

        function createEnvelope(envelope) {
            console.log('here');
            if(envelope.due_date) {
                envelope.due_date = envelope.due_date.getTime() / 1000;
            }
            return $http.post(ENV.apiEndpoint + 'envelopes', envelope).then(function(response) {
                getEnvelopes();
                vm.modal.hide();
            });
        }

        function showEnvelope(envelope) {
            $state.go('tab.envelopes-show', {envelopeId: envelope.id});
        }

        function cancel() {
            vm.modal.hide();
        }

        function getEnvelopeColor(envelope) {
            if(envelope.balance === 0) {
                return 'grey';
            }
            if(envelope.balance > 0) {
                return 'green';
            }
            if(envelope.balance < 0) {
                return 'red';
            }
        }
        $scope.openModal = function() {

        };
        $scope.closeModal = function() {
            $scope.modal.hide();
        };

        // Execute action on hide modal
        $scope.$on('modal.hidden', function() {
            // Execute action
        });
        // Execute action on remove modal
        $scope.$on('modal.removed', function() {
            // Execute action
        });

        //Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function() {
            vm.modal.remove();
        });
    }

})();
