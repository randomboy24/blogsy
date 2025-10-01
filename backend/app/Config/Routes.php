<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->get('/', 'Home::index');

// Your existing test route for database connectivity
$routes->get('check', 'Auth::check');

// =========================================================================
// This is the CORRECT way to define your API routes with the CORS filter.
// All routes for your API go INSIDE this one group definition.
// =========================================================================
$routes->group('api', ['filter' => 'cors'], static function (RouteCollection $routes): void {

    // 1. Handle CORS preflight OPTIONS requests for ALL paths within the 'api' group.
    // The 'cors' filter (applied to the group) will add the necessary headers.
    // The closure itself simply returns a 204 No Content   response, which is standard for preflights.
    $routes->options('(:any)', static function () {
        return service('response')->setStatusCode(204)->setBody('');
    });

    // 2. Define your actual API routes for your Auth controller
    // These routes will automatically have the 'cors' filter applied to them
    // because they are within this filtered group.
    $routes->post('signup', 'Auth::signup');
    $routes->post('signin', 'Auth::signin');
    $routes->get('send', 'Auth::test');

    $routes->get('categories','AdminController::getCategories');
    $routes->post('category','AdminController::addCategory');
    $routes->delete('category/(:segment)', 'AdminController::deleteCategory/$1');
    $routes->post('like','BlogController::likeblog');
    $routes->get('blog/(:segment)/likes', 'BlogController::getBlogLikes/$1');
    
    $routes->post('unlike','BlogController::unlikeBlog');
    $routes->get('blog/(:segment)', 'BlogController::getBlog/$1');
    $routes->get('blogs/search', 'BlogController::searchBlogs');
    $routes->get('logout', 'Auth::logout');

    // If you have other API endpoints (e.g., for users, products, etc.),
    // they would also go inside this same 'api' group.
    // Example:
    // $routes->get('products', 'Product::index');
    // $routes->post('products', 'Product::create');
    // $routes->put('products/(:num)', 'Product::update/$1');
    // $routes->delete('products/(:num)', 'Product::delete/$1');

});


$routes->group('api',['filter' => 'jwt'], static function (RouteCollection $routes): void {
    $routes->options('(:any)', static function () {
        return service('response')->setStatusCode(204)->setBody('');
    });
    $routes->post('blog','BlogController::setBlog');
    $routes->get('blogs','BlogController::getBlogs');
});
