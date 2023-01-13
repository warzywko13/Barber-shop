<?php

use App\Http\Controllers\VisitController;
use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

/*Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});*/

Route::get('/get_all_visits', [VisitController::class, 'get_all_visits']);

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);



Route::middleware('auth:sanctum')->group(function () {
    Route::get('user', [\App\Http\Controllers\AuthController::class, 'user']);
    Route::post('logout', [\App\Http\Controllers\AuthController::class, 'logout']);
    Route::post('/add_visit', [VisitController::class, 'add_visit']);
    Route::post('/get_visit/{id}', [VisitController::class, 'get_visit']);
    Route::post('/edit_visit/{id}', [VisitController::class, 'edit_visit']);
    Route::get('/delete_visit/{id}', [VisitController::class, 'delete_visit']);
});
