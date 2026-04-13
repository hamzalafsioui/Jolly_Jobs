<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Profile\UpdateProfileRequest;
use App\Http\Resources\UserResource;
use App\Http\Responses\ApiResponse;
use App\Services\ProfileService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Exception;
class ProfileController extends Controller
{
    public function __construct(
        private readonly ProfileService $profileService
    ) {}

    /**
     * Get the authenticated user's profile
     */
    public function show(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            $profile = $this->profileService->getProfile($user);
            return ApiResponse::success(new UserResource($profile));
        } catch (Exception $e) {
            return ApiResponse::serverError($e->getMessage());
        }
    }

    /**
     * Update the authenticated user's profile
     */
    public function update(UpdateProfileRequest $request): JsonResponse
    {
        try {
            $user = $request->user();
            $profile = $this->profileService->updateProfile($user, $request->validated());
            return ApiResponse::success(new UserResource($profile), 'Profile updated successfully.');
        } catch (Exception $e) {
            return ApiResponse::serverError($e->getMessage());
        }
    }
}
