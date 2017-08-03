/**
 * Module dependencies
 */

var util = require('util');
var replace = require("replace");
var _ = require('lodash');
_.defaults = require('merge-defaults');
_.str = require('underscore.string');
/**
 * sails-generate-crud
 *
 * Usage:
 * `sails generate crud`
 *
 * @description Generates a crud
 * @help See http://links.sailsjs.org/docs/generators
 */

module.exports = {
    /**
     * `before()` is run before executing any of the `targets`
     * defined below.
     *
     * This is where we can validate user input, configure default
     * scope variables, get extra dependencies, and so on.
     *
     * @param  {Object} scope
     * @param  {Function} cb    [callback]
     */
    before:             function (scope, cb)
                        {
                            // scope.args are the raw command line arguments.
                            //
                            // e.g. if someone runs:
                            // $ sails generate crud user find create update
                            // then `scope.args` would be `['user', 'find', 'create', 'update']`
                            if(!scope.args[0])
                            {
                                return cb(new Error('Please provide a name for this crud.'));
                            }
                            // scope.rootPath is the base path for this generator
                            //
                            // e.g. if this generator specified the target:
                            // './Foobar.md': { copy: 'Foobar.md' }
                            //
                            // And someone ran this generator from `/Users/dbowie/sailsStuff`,
                            // then `/Users/dbowie/sailsStuff/Foobar.md` would be created.
                            if(!scope.rootPath)
                            {
                                return cb(INVALID_SCOPE_VARIABLE('rootPath'));
                            }
                            // Attach defaults
                            var parent = scope.args[1] ? _.upperFirst(scope.args[1]) : '';
                            _.defaults(scope, {
                                createdAt:            new Date(),
                                parent:               parent,
                                controllerPath:       parent ? parent : _.upperFirst(scope.args[0]),
                                controllerName:       _.upperFirst(scope.args[0]),
                                controllerFile:       _.upperFirst(scope.args[0]) + 'Controller.js',
                                modelPath:            parent ? parent : _.upperFirst(scope.args[0]),
                                modelName:            parent + _.upperFirst(scope.args[0]),
                                modelFile:            parent + _.upperFirst(scope.args[0]) + '.js',
                                routerName:           _.snakeCase(parent) + (parent ? '.' : '') + _.snakeCase(scope.args[0]),
                                routerFile:           _.snakeCase(parent) + (parent ? '.' : '') + _.snakeCase(scope.args[0]) + '.js',
                                policyPath:           parent ? parent : _.upperFirst(scope.args[0]),
                                policyName:           _.upperFirst(scope.args[0]),
                                policyFile:           _.snakeCase(parent) + (parent ? '.' : '') + _.snakeCase(scope.args[0]) + '.js',
                                menuFile:             _.snakeCase(parent) + (parent ? '.' : '') + _.snakeCase(scope.args[0]) + '.json',
                                menuId:               _.kebabCase(parent) + (parent ? '-' : '') + _.kebabCase(scope.args[0]),
                                menuParent:           _.kebabCase(parent),
                                menuName:             _.kebabCase(scope.args[0]),
                                document:             parent + _.upperFirst(scope.args[0]),
                                viewPath:             parent ? _.snakeCase(parent) : _.snakeCase(scope.args[0]),
                                viewFront:            parent ? _.snakeCase(parent) + '/front/' + _.snakeCase(scope.args[0]) : _.snakeCase(scope.args[0]) + '/front',
                                viewAdmin:            parent ? _.snakeCase(parent) + '/admin/' + _.snakeCase(scope.args[0]) : _.snakeCase(scope.args[0]) + '/admin',
                                viewPartial:          parent ? '../../../' : '../../',
                                viewTitle:            _.kebabCase(parent) + (parent ? 's : ' : '') + _.kebabCase(scope.args[0]) + 's',
                                viewBreadcrumbParent: _.kebabCase(parent) + 's',
                                viewBreadcrumb:       _.kebabCase(scope.args[0]) + 's',
                                route:                _.kebabCase(parent) + (parent ? '-' : '') + _.kebabCase(scope.args[0]),
                                routeName:            _.snakeCase(parent) + (parent ? '_' : '') + _.snakeCase(scope.args[0]),
                                routeParent:          _.snakeCase(parent),
                                styleClass:           _.kebabCase(parent) + (parent ? '-' : '') + _.kebabCase(scope.args[0]),
                                styleFile:            '_' + (_.kebabCase(parent) + (parent ? '_' : '') + _.kebabCase(scope.args[0])) + '.scss'
                            });
                            // Folders
                            create_folder('./api/controllers/' + scope.controllerPath + '/Admin');
                            create_folder('./api/models/' + scope.modelPath);
                            create_folder('./views/' + scope.viewFront);
                            create_folder('./views/' + scope.viewAdmin);
                            // When finished, we trigger a callback with no error
                            // to begin generating files/folders as specified by
                            // the `targets` below.
                            cb();
                        },
    /**
     * @param scope
     * @param cb
     */
    after:              function (scope, cb)
                        {
                            replace({
                                regex:       "<_%",
                                replacement: "<%",
                                paths:       ['./views/' + scope.viewPath],
                                recursive:   true,
                                silent:      true
                            });
                            replace({
                                regex:       "%_>",
                                replacement: "%>",
                                paths:       ['./views/' + scope.viewPath],
                                recursive:   true,
                                silent:      true
                            });
                            cb();
                        },
    /**
     * The files/folders to generate.
     * @type {Object}
     */
    targets:            {
        './api/controllers/:controllerPath/:controllerFile':       {template: 'controller.front'},
        './api/controllers/:controllerPath/Admin/:controllerFile': {template: 'controller.admin'},
        './api/models/:modelPath/:modelFile':                      {template: 'model'},
        './config/routes/:routerFile':                             {template: 'router'},
        './config/policies/:policyFile':                           {template: 'policy'},
        './config/menus/:menuFile':                                {template: 'menu'},
        './views/:viewFront/index.ejs':                            {template: 'view.index.ejs'},
        './views/:viewFront/detail.ejs':                           {template: 'view.detail.ejs'},
        './views/:viewFront/create.ejs':                           {template: 'view.create.ejs'},
        './views/:viewFront/update.ejs':                           {template: 'view.update.ejs'},
        './views/:viewAdmin/index.ejs':                            {template: 'view.admin.index.ejs'},
        './views/:viewAdmin/detail.ejs':                           {template: 'view.admin.detail.ejs'},
        './views/:viewAdmin/create.ejs':                           {template: 'view.admin.create.ejs'},
        './views/:viewAdmin/update.ejs':                           {template: 'view.admin.update.ejs'},
        './assets/styles/front/project/:styleFile':                {template: 'style'}
    },
    /**
     * The absolute path to the `templates` for this generator
     * (for use with the `template` helper)
     *
     * @type {String}
     */
    templatesDirectory: require('path').resolve(__dirname, './templates')
};
/**
 * INVALID_SCOPE_VARIABLE()
 *
 * Helper method to put together a nice error about a missing or invalid
 * scope variable. We should always validate any required scope variables
 * to avoid inadvertently smashing someone's filesystem.
 *
 * @param {String} varname [the name of the missing/invalid scope variable]
 * @param {String} details [optional - additional details to display on the console]
 * @param {String} message [optional - override for the default message]
 * @return {Error}
 * @api private
 */

function INVALID_SCOPE_VARIABLE(varname, details, message)
{
    var DEFAULT_MESSAGE =
        'Issue encountered in generator "crud":\n' +
        'Missing required scope variable: `%s`"\n' +
        'If you are the author of `sails-generate-crud`, please resolve this ' +
        'issue and publish a new patch release.';
    message = (message || DEFAULT_MESSAGE) + (details ? '\n' + details : '');
    message = util.inspect(message, varname);
    return new Error(message);
}
function create_folder(path)
{
    var fs = require("fs-extra");
    fs.ensureDirSync(path);
}