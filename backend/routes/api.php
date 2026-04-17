<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\ApplicationController;
use App\Http\Controllers\Api\JobOfferController;
use App\Http\Controllers\Api\RecruiterDashboardController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\SkillController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\AdminDashboardController;


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
    Route::get('/me', [AuthController::class, 'me'])->middleware('auth:sanctum');
    
    Route::get('/profile', [ProfileController::class, 'show'])->middleware('auth:sanctum');
    Route::post('/profile', [ProfileController::class, 'update'])->middleware('auth:sanctum');
});



// User Management
Route::apiResource('users', UserController::class)->middleware('auth:sanctum');


// Job Offers
Route::get('user/saved-jobs', [JobOfferController::class, 'savedJobs'])->middleware('auth:sanctum');
Route::post('job-offers/{id}/save', [JobOfferController::class, 'toggleSave'])->middleware('auth:sanctum');
Route::get('job-offers/latest', [JobOfferController::class, 'latest']);
Route::get('job-offers/contract-types', [JobOfferController::class, 'contractTypes']);
Route::get('job-offers/job-title-suggestions', [JobOfferController::class, 'jobTitleSuggestions']);
Route::get('cities', [JobOfferController::class, 'cities']);
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


// Admin Dashboard
Route::prefix('admin')->middleware('auth:sanctum')->group(function () {
    Route::get('/dashboard', [AdminDashboardController::class, 'getStats']);
    Route::apiResource('skills', SkillController::class);
});

// Recruiter Dashboard
Route::prefix('recruiter')->middleware('auth:sanctum')->group(function () {
    Route::get('/dashboard', [RecruiterDashboardController::class, 'getStats']);
    Route::get('/jobs', [RecruiterDashboardController::class, 'myJobs']);
    Route::get('/applications', [RecruiterDashboardController::class, 'myApplications']);
});

Route::get('/test-connection', function () {
    return response()->json([
        'message' => 'Hello from Laravel Backend! -)',
        'status' => 'success',
        'database' => DB::connection()->getDatabaseName()
    ]);
});

Route::get('skills', [SkillController::class, 'index']);
Route::get('categories', [CategoryController::class, 'index']);
