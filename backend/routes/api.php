<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\ApplicationController;
use App\Http\Controllers\Api\JobOfferController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
    Route::get('/me', [AuthController::class, 'me'])->middleware('auth:sanctum');
});



// User Management
Route::apiResource('users', UserController::class)->middleware('auth:sanctum');


// Job Offers
Route::get('job-offers/latest', [JobOfferController::class, 'latest']);
Route::apiResource('job-offers', JobOfferController::class)->only(['index', 'show']);
Route::apiResource('job-offers', JobOfferController::class)->except(['index', 'show'])->middleware('auth:sanctum');

// Application Tracking
Route::prefix('applications')->middleware('auth:sanctum')->group(function () {
    Route::post('/apply/{jobOfferId?}', [ApplicationController::class, 'apply']);
    Route::get('/{id}', [ApplicationController::class, 'show']);
    Route::patch('/{id}/status', [ApplicationController::class, 'updateStatus']);
    Route::get('/job-seeker/{jobSeekerId}', [ApplicationController::class, 'jobSeekerApplications']);
    Route::get('/offer/{jobOfferId}', [ApplicationController::class, 'offerApplications']);
});

Route::get('/test-connection', function () {
    return response()->json([
        'message' => 'Hello from Laravel Backend! -)',
        'status' => 'success',
        'database' => DB::connection()->getDatabaseName()
    ]);
});
