<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CupboardController;
use App\Http\Controllers\PlaceController;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\BorrowRecordController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ActivityLogController;

Route::post('/login',[AuthController::class,'login']);


Route::middleware('auth:sanctum')->group(function(){

        Route::post('/create-user',[AuthController::class,'createUser']);
        Route::get('/users',[AuthController::class,'getUsers']);
        Route::apiResource('cupboards', CupboardController::class);
        Route::apiResource('places', PlaceController::class);
        Route::apiResource('items', ItemController::class);
        Route::get('/activity-logs',[ActivityLogController::class,'index']);
        Route::post('borrow', [BorrowRecordController::class, 'borrowItem']);
        Route::post('return/{id}', [BorrowRecordController::class, 'returnItem']);
        Route::get('/borrow', [BorrowRecordController::class, 'borrowedItems']);
        Route::get('/return', [BorrowRecordController::class, 'returnedItems']);
});


Route::get('/test', function () {
    return "API working";
});