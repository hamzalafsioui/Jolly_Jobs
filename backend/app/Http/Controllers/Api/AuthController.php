<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Http\Responses\ApiResponse;
use App\Services\UserService;
use Illuminate\Http\JsonResponse;

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
}
