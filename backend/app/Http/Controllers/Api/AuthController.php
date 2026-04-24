<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Http\Responses\ApiResponse;
use App\Services\UserService;
use Illuminate\Http\JsonResponse;
use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
use App\Models\JobSeeker;
use App\Models\Recruiter;
use Illuminate\Http\Request;
use GuzzleHttp\Client;
use Exception;
use Illuminate\Support\Facades\Log;
class AuthController extends Controller
{
    public function __construct(
        private readonly UserService $userService
    ) {}

    /**
     * Register a new user.
     */
    public function register(RegisterRequest $request): JsonResponse
    {
        $result = $this->userService->register($request->validated());

        return ApiResponse::created([
            'user'  => new UserResource($result['user']),
            'token' => $result['token'],
        ], 'User registered successfully.');
    }

    /**
     * Authenticate a user and return a token.
     */
    public function login(LoginRequest $request): JsonResponse
    {
        $result = $this->userService->login(
            $request->email,
            $request->password
        );

        if (! $result) {
            return ApiResponse::unauthorized('Invalid credentials.');
        }

        return ApiResponse::success([
            'user'  => new UserResource($result['user']),
            'token' => $result['token'],
        ], 'Login successful.');
    }

    /**
     * Log the user out (Invalidate the token).
     */
    public function logout(): JsonResponse
    {
        $this->userService->logout();

        return ApiResponse::success(null, 'Successfully logged out.');
    }


    /**
     * Get the authenticated User.
     */
    public function me(): JsonResponse
    {
        $user = $this->userService->me();

        return ApiResponse::success(new UserResource($user));
    }

    public function getGoogleAuthUrl(): JsonResponse
    {
        return ApiResponse::success([
            'url' => Socialite::driver('google')->stateless()->redirect()->getTargetUrl(),
        ]);
    }

    public function handleGoogleCallback(Request $request): JsonResponse
    {
        try {
            $driver = Socialite::driver('google')
                ->stateless()
                ->redirectUrl(config('services.google.redirect'));

            // On local dev => PHP often lacks a CA bundle for SSL verification.
            // Disable only in local  always verified in production.
            if (app()->environment('local')) {
                $driver->setHttpClient(new Client(['verify' => false]));
            }

            $googleUser = $driver->user();
            
            $user = User::where('google_id', $googleUser->id)->orWhere('email', $googleUser->email)->first();
            
            if (!$user) {
                // Split name
                $nameParts = explode(' ', $googleUser->name, 2);
                $firstName = $nameParts[0] ?? '';
                $lastName = $nameParts[1] ?? '';

                $user = User::create([
                    'google_id' => $googleUser->id,
                    'first_name' => $firstName ?: 'Google User',
                    'last_name' => $lastName,
                    'email' => $googleUser->email,
                    'photo' => $googleUser->avatar,
                    'role' => $request->role ?? 'job_seeker',
                    'email_verified_at' => now(),
                ]);

                // Create associated profile
                if ($user->role === 'job_seeker') {
                    JobSeeker::create(['user_id' => $user->id]);
                } else {
                    Recruiter::create([
                        'user_id' => $user->id,
                        'company_name' => $user->first_name . "'s Company",
                    ]);
                }
            } elseif (!$user->google_id) {
                $user->update(['google_id' => $googleUser->id, 'photo' => $googleUser->avatar]);
            }

            // Double check that the associated profile exists
            if ($user->role === 'job_seeker' && !$user->jobSeeker) {
                JobSeeker::create(['user_id' => $user->id]);
            } elseif ($user->role === 'recruiter' && !$user->recruiter) {
                Recruiter::create([
                    'user_id' => $user->id,
                    'company_name' => $user->first_name . "'s Company",
                ]);
            }
            
            $token = $user->createToken('auth_token')->plainTextToken;
            
            return ApiResponse::success([
                'user'  => new UserResource($user),
                'token' => $token,
            ], 'Google Login successful.');

        } catch (Exception $e) {
            Log::error('Google Auth Error: ' . $e->getMessage(), [
                'exception' => $e,
            ]);

            return ApiResponse::unauthorized('Failed to authenticate with Google. Please try again.');
        }
    }
}
