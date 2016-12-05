(function() {
  'use strict';

  angular
    .module('app.analytics', [
      'app.analytics.organic',
      'app.analytics.crossChannel',
      'app.analytics.paidMedia',
      'app.analytics.phoneCalls',
      'app.analytics.goalCompletions',
      'app.analytics.value'
    ]);
})();
