// (C) Copyright 2015 Martin Dougiamas
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

angular.module('mm.addons.dashboard')

/**
 * Controller to handle dashboard.
 *
 * @module mm.addons.dashboard
 * @ngdoc controller
 * @name mmaDashboardListCtrl
 */
.controller('mmaDashboardListCtrl', function($scope, $stateParams, $mmUtil, $mmaDashboard, $mmSite, $translate) {

    var courseid = $stateParams.courseid,
        type = $stateParams.type;

    $scope.courseid = courseid;
    $scope.type = type;

    $translate('mma.dashboard.' + type + 'dashboard').then(function(string) {
        $scope.title = string;
    });

    function fetchDashboard(refresh) {
        return $mmaDashboard.getDashboard(courseid, refresh).then(function(dashboard) {
            dashboard = dashboard[type + 'dashboard'];

            return $mmaDashboard.getDashboardUserData(dashboard, courseid).then(function(dashboard) {
                $scope.dashboard = dashboard;
            });

        }, function(message) {
            $mmUtil.showErrorModal(message);
        });
    }

    fetchDashboard().then(function() {
        // Add log in Moodle.
        $mmSite.write('core_dashboard_view_dashboard', {
            courseid: courseid,
            userid: 0
        });
    })
    .finally(function() {
        $scope.dashboardLoaded = true;
    });

    $scope.refreshDashboard = function() {
        fetchDashboard(true).finally(function() {
            $scope.$broadcast('scroll.refreshComplete');
        });
    };
});
