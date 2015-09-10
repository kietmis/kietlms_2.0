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

angular.module('mm.addons.dashboard', [])

.constant('mmaDashboardPriority', 200)
.constant('mmaDashboardAddNotePriority', 200)

.config(function($stateProvider, $mmUserDelegateProvider, $mmSideMenuDelegateProvider, mmaDashboardPriority, mmaDashboardAddNotePriority) {

    $stateProvider

    .state('site.dashboard', {
        url: '/dashboard',
        views: {
            'site': {
                templateUrl: 'addons/dashboard/templates/index.html',
                controller: 'mmaDashboardIndexCtrl'
            }
        },
        params: {
            course: null
        }
    })

    .state('site.dashboard-list', {
        url: '/dashboard-list',
        views: {
            'site': {
                templateUrl: 'addons/dashboard/templates/list.html',
                controller: 'mmaDashboardListCtrl'
            }
        },
        params: {
            courseid: null,
            type: null
        }
    });

    // Register plugin on user profile.
    $mmUserDelegateProvider.registerProfileHandler('mmaDashboard:addNote', '$mmaDashboardHandlers.addNote', mmaDashboardAddNotePriority);

    // Register courses handler.
    $mmCoursesDelegateProvider.registerNavHandler('mmaDashboard', '$mmaDashboardHandlers.sideMenuNav', mmaDashboardPriority);
});
