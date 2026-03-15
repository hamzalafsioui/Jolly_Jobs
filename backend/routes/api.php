<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/test-connection', function () {
    return response()->json([
        'message' => 'Hello from Laravel Backend! -)',
        'status' => 'success',
        'database' => DB::connection()->getDatabaseName()
    ]);
});
