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
 * Dashboard factory.
 *
 * @module mm.addons.dashboard
 * @ngdoc service
 * @name $mmaDashboard
 */
.factory('$mmaDashboard', function($mmSite, $log, $q, $mmUser, $translate) {
    $log = $log.getInstance('$mmaDashboard');

    var self = {};

    /**
     * Add a note.
     *
     * @module mm.addons.dashboard
     * @ngdoc method
     * @name $mmaDashboard#addNote
     * @param {Number} userId       User ID of the person to add the note.
     * @param {Number} courseId     Course ID where the note belongs.
     * @param {String} publishState Personal, Site or Course.
     * @param {String} noteText     The note text.
     * @return {Promise}
     */
    self.addNote = function(userId, courseId, publishState, noteText) {
        var data = {
            "dashboard[0][userid]" : userId,
            "dashboard[0][publishstate]": publishState,
            "dashboard[0][courseid]": courseId,
            "dashboard[0][text]": noteText,
            "dashboard[0][format]": 1
        };
        return $mmSite.write('core_dashboard_create_dashboard', data);
    };

    /**
     * Returns whether or not the add note plugin is enabled for the current site.
     *
     * This method is called quite often and thus should only perform a quick
     * check, we should not be calling WS from here.
     *
     * @module mm.addons.dashboard
     * @ngdoc method
     * @name $mmaDashboard#isPluginAddNoteEnabled
     * @return {Boolean}
     */
    self.isPluginAddNoteEnabled = function() {
        var infos;

        if (!$mmSite.isLoggedIn()) {
            return false;
        } else if (!$mmSite.canUseAdvancedFeature('enabledashboard')) {
            return false;
        } else if (!$mmSite.wsAvailable('core_dashboard_create_dashboard')) {
            return false;
        }

        return true;
    };

    /**
     * Returns whether or not the read dashboard plugin is enabled for the current site.
     *
     * This method is called quite often and thus should only perform a quick
     * check, we should not be calling WS from here.
     *
     * @module mm.addons.dashboard
     * @ngdoc method
     * @name $mmaDashboard#isPluginViewDashboardEnabled
     * @return {Boolean}
     */
    self.isPluginViewDashboardEnabled = function() {
        var infos;

        if (!$mmSite.isLoggedIn()) {
            return false;
        } else if (!$mmSite.canUseAdvancedFeature('enabledashboard')) {
            return false;
        } else if (!$mmSite.wsAvailable('core_dashboard_get_course_dashboard')) {
            return false;
        }

        return true;
    };

    /**
     * Get users dashboard for a certain site, course and personal dashboard.
     *
     * @module mm.addons.dashboard
     * @ngdoc method
     * @name $mmaDashboard#getDashboard
     * @param {Number} courseid ID of the course to get the dashboard from.
     * @param {Boolean} refresh True when we should not get the value from the cache.
     * @return {Promise}        Promise to be resolved when the dashboard are retrieved.
     */
    self.getDashboard = function(courseid, refresh) {

        $log.debug('Get dashboard for course ' + courseid);

        var data = {
                courseid : courseid
            },
            presets = {};
        if (refresh) {
            presets.getFromCache = false;
        }

        return $mmSite.read('core_dashboard_get_course_dashboard', data, presets);
    };

    /**
     * Get user data for dashboard since they only have userid.
     *
     * @module mm.addons.dashboard
     * @ngdoc method
     * @name $mmaDashboard#getDashboardUserData
     * @param {Object[]} dashboard       Dashboard to get the data for.
     * @param {Number}   courseid    ID of the course the dashboard belong to.
     * @return {Promise}             Promise always resolved. Resolve param is the formatted dashboard.
     */
    self.getDashboardUserData = function(dashboard, courseid) {
        var promises = [];

        angular.forEach(dashboard, function(note) {
            var promise = $mmUser.getProfile(note.userid, courseid, true).then(function(user) {
                note.userfullname = user.fullname;
                note.userprofileimageurl = user.profileimageurl;
            }, function() {
                // Error getting profile. Set default data.
                return $translate('mma.dashboard.userwithid', {id: note.userid}).then(function(str) {
                    note.userfullname = str;
                });
            });
            promises.push(promise);
        });
        return $q.all(promises).then(function() {
            return dashboard;
        });
    };

    return self;
});
