(function() {
  'use strict';

  /**
   * Main module of the Fuse
   */
  angular
    .module('fuse', [

      // Core
      'app.core',

      // Navigation
      'app.navigation',

      // Toolbar
      'app.toolbar',

      // Quick Panel
      'app.quick-panel',

      // pages
      'app.pages',

      // dashboard
      'app.dashboard',

      // analytics
      'app.analytics',

      // task summaries
      'app.task-summaries',

      // reports
      'app.reports'
    ]);
})();
