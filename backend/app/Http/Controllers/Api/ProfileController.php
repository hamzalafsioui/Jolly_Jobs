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
use App\Models\User;
use App\Services\CvParsingService;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class ProfileController extends Controller
{
    public function __construct(
        private readonly ProfileService $profileService,
        private readonly CvParsingService $cvParsingService
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
     * Get a public job seeker profile (for recruiters)
     */
    public function showJobSeekerProfil(int $id): JsonResponse
    {
        try {
            $user = User::findOrFail($id);

            if ($user->role !== 'job_seeker') {
                return ApiResponse::error('Not a job seeker profile.', 404);
            }

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

    /**
     * Scan the user CV to suggest skills.
     */
    public function scanCv(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            $jobSeeker = $user->jobSeeker;

            if (!$jobSeeker || !$jobSeeker->cv_path) {
                return ApiResponse::error('No CV found. Please upload your CV first.', 400);
            }

            
            $filePath = storage_path('app/public/' . $jobSeeker->cv_path);


            if (!file_exists($filePath)) {
                return ApiResponse::error('CV file not found on server. Path: ' . $jobSeeker->cv_path, 404);
            }

            // Extract text and scan for skills
            $text = $this->cvParsingService->extractTextFromPdf($filePath);

            $foundSkills = $this->cvParsingService->scanSkills($text);

            // Filter out skills the user already has
            $existingSkillIds = $jobSeeker->skills->pluck('id')->toArray();
            $newSuggestions = array_filter($foundSkills, function ($skill) use ($existingSkillIds) {
                return !in_array($skill['id'], $existingSkillIds);
            });



            return ApiResponse::success(array_values($newSuggestions), 'CV scanned successfully.');
        } catch (Exception $e) {

            return ApiResponse::serverError('Failed to scan CV: ' . $e->getMessage());
        }
    }
}
