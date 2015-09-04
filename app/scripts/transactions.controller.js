(function () {
    'use strict';

    angular
        .module('banking')
        .controller('TransactionsController', TransactionsController);

    /* @ngInject */
    function TransactionsController($http,
                                    $scope,
                                    ENV,
                                    $ionicModal) {
        /* jshint validthis: true */
        var vm = this;

        vm.activate = activate;
        vm.title = 'Transactions';
        vm.doRefresh = doRefresh;
        vm.showAssignTransaction = showAssignTransaction;
        vm.assignTransactionToEnvelope = assignTransactionToEnvelope;
        vm.cancelAssignTransaction = cancelAssignTransaction;

        activate();

        ////////////////

        function activate() {
            $http.get(ENV.apiEndpoint + 'transactions').then(function(response) {
                vm.transactions = response.data;
            });

            $ionicModal.fromTemplateUrl('templates/transactions-assign.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function(modal) {
                vm.modal = modal;
            });
        }

        function showAssignTransaction(transaction) {
            vm.transaction = transaction;
            vm.modal.show();
            $http.get(ENV.apiEndpoint + 'envelopes').then(function(response) {
                vm.envelopes = response.data;
            });
        }

        function assignTransactionToEnvelope(transaction, envelope) {
            vm.modal.hide();
            vm.transactions = _.without(vm.transactions, transaction);

            $http.put(ENV.apiEndpoint + 'transactions/' + transaction.id, {
                'envelope_id': envelope.id
            }).then(function() {
            });
        }

        function doRefresh() {
            $http.get(ENV.apiEndpoint + 'update').then(function(response) {
                vm.transactions = response.data;
                $scope.$broadcast('scroll.refreshComplete');
            });
        }
        function cancelAssignTransaction() {
            console.log('hello world');
            vm.modal.hide();
        }

        $scope.$on('$destroy', function() {
            vm.modal.remove();
        });

    }
})();
