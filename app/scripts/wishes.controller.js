(function () {

    'use strict';
    angular
        .module('banking')
        .controller('WishesController', WishesController);

    /* @ngInject */
    function WishesController($http, ENV, $ionicModal, $scope) {
        /* jshint validthis: true */
        var vm = this;

        vm.activate = activate;
        vm.title = 'Wishes';
        vm.showCreateWish = showCreateWish;
        vm.createWish = createWish;
        vm.cancel = cancel;

        activate();

        $ionicModal.fromTemplateUrl('templates/wishes-create.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            vm.modal = modal;
        });

        $scope.$on('$ionicView.enter', function(e) {
            activate();
        });

        ////////////////

        function activate() {
            getMe();
            getSpendingEnvelope().then(getWishes);
        }

        function getWishes() {
            return $http.get(ENV.apiEndpoint + 'wishes').then(function(response) {
                vm.wishes = response.data;
                // calculate days
                _.each(vm.wishes, function(wish, index) {
                    if(index === 0) {
                        wish.days = (wish.amount - vm.spendingEnvelope.balance) / vm.spendingEnvelope.amount;
                    } else {
                        var previousDays = vm.wishes[index - 1].days;
                        wish.days = previousDays + (wish.amount / vm.spendingEnvelope.amount);
                    }
                    var dueDate = new Date();
                    dueDate.setDate(dueDate.getDate() + Math.ceil(wish.days));
                    wish.dueDate = dueDate;
                })
            });
        }

        function getMe() {
            return $http.get(ENV.apiEndpoint + 'me').then(function(response) {
                vm.me = response.data;
            });
        }

        function getSpendingEnvelope() {
            return $http.get(ENV.apiEndpoint + 'envelopes').then(function(response) {
                var envelopes = response.data;
                vm.spendingEnvelope = _.find(envelopes, {name: 'Spending'});
            });
        }


        function showCreateWish() {
            vm.newWish = {};
            vm.modal.show();
        }

        function createWish(envelope) {
            return $http.post(ENV.apiEndpoint + 'wishes', envelope).then(function(response) {
                getWishes();
                vm.modal.hide();
            });
        }

        function cancel() {
            vm.modal.hide();
        }

        //Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function() {
            vm.modal.remove();
        });


    }

})();
