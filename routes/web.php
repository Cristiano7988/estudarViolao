<?php

use App\Http\Controllers\ExerciciosController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Auth::routes();

Route::fallback(function () {
    return view("home");
});

Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])->name('home');

Route::post('/admin/estudantes', [App\Http\Controllers\HomeController::class, 'getEstudantes']);
Route::post('/admin/exercicios', [App\Http\Controllers\HomeController::class, 'getExercicios']);

Route::post('/salvar-resultado', [ExerciciosController::class, 'store']);

Route::get('/resultados/{resultado}', [ExerciciosController::class, 'getResultados']);

Route::get('/conclui/{resultado}', [ExerciciosController::class, 'conclui']);