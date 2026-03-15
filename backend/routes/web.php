<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'app' => 'Jolly Jobs API',
        'status' => 'OK',
        'version' => '1.0.0'
    ]);
});
