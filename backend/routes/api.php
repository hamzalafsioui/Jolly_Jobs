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
use App\Http\Controllers\Api\MessageController;
use App\Http\Controllers\Api\NotificationController;
use Illuminate\Support\Facades\Broadcast;
use App\Http\Controllers\Api\CityController;


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Broadcast::routes(['middleware' => ['auth:sanctum']]);

// Auth => rate limiting (10 req/min per IP)
Route::prefix('auth')->middleware('throttle:auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::get('/google/url', [AuthController::class, 'getGoogleAuthUrl']);
    Route::post('/google/callback', [AuthController::class, 'handleGoogleCallback']);
    Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
    Route::get('/me', [AuthController::class, 'me'])->middleware('auth:sanctum');

    Route::get('/profile', [ProfileController::class, 'show'])->middleware('auth:sanctum');
    Route::post('/profile', [ProfileController::class, 'update'])->middleware('auth:sanctum');
    Route::post('/profile/scan-cv', [ProfileController::class, 'scanCv'])->middleware('auth:sanctum');
    Route::get('/job-seekers/{id}', [ProfileController::class, 'showJobSeekerProfil'])->middleware('auth:sanctum');
});



// User Management
Route::apiResource('users', UserController::class)->middleware(['auth:sanctum', 'throttle:api']);


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
    Route::delete('/{id}', [ApplicationController::class, 'destroy']);
    Route::patch('/{id}/status', [ApplicationController::class, 'updateStatus']);
    Route::get('/job-seeker/{jobSeekerId}', [ApplicationController::class, 'jobSeekerApplications']);
    Route::get('/offer/{jobOfferId}', [ApplicationController::class, 'offerApplications']);
    Route::get('/{id}/cv', [ApplicationController::class, 'downloadCvFile']);
});


// Admin Dashboard
Route::prefix('admin')->middleware('auth:sanctum')->group(function () {
    Route::get('/dashboard', [AdminDashboardController::class, 'getStats']);
    Route::apiResource('skills', SkillController::class);
    Route::apiResource('cities', CityController::class);
});

// Recruiter Dashboard
Route::prefix('recruiter')->middleware('auth:sanctum')->group(function () {
    Route::get('/dashboard', [RecruiterDashboardController::class, 'getStats']);
    Route::get('/jobs', [RecruiterDashboardController::class, 'myJobs']);
    Route::get('/applications', [RecruiterDashboardController::class, 'myApplications']);
});

// Messages
Route::prefix('messages')->middleware('auth:sanctum')->group(function () {
    Route::get('/unread-count', [MessageController::class, 'unreadCount']);
    Route::get('/conversations', [MessageController::class, 'conversations']);
    Route::get('/{userId}', [MessageController::class, 'history']);
    Route::post('/{userId}', [MessageController::class, 'send']);
    Route::patch('/{userId}/read', [MessageController::class, 'markRead']);
});

// Notifications
Route::prefix('notifications')->middleware('auth:sanctum')->group(function () {
    Route::get('/', [NotificationController::class, 'index']);
    Route::patch('/read-all', [NotificationController::class, 'markAllRead']);
    Route::patch('/{id}/read', [NotificationController::class, 'markRead']);
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
