<?php

namespace App\Services;

use App\Models\User;
use App\Repositories\Contracts\UserRepositoryInterface;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class UserService
{
    public function __construct(
        private readonly UserRepositoryInterface $userRepository
    ) {}

    /**
     * Register a new user and return a Sanctum token alongside the user.
     *
     * @return array{user: User, token: string}
     */
    public function register(array $data): array
    {
        $user = $this->userRepository->create([
            'first_name' => $data['first_name'],
            'last_name'  => $data['last_name'],
            'email'      => $data['email'],
            'password' => Hash::make($data['password']),
            'role'     => $data['role'],      // 'job_seeker' | 'recruiter'
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return compact('user', 'token');
    }

    /**
     * Attempt login and return a Sanctum token, or null on failure.
     *
     * @return array{user: User, token: string}|null
     */
    public function login(string $email, string $password): ?array
    {
        $user = $this->userRepository->findByEmail($email);

        if (! $user || ! Hash::check($password, $user->password)) {
            return null;
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return compact('user', 'token');
    }

    public function logout(): void
    {
        Auth::user()->currentAccessToken()->delete();
    }


    /**
     * Return the currently authenticated user.
     */
    public function me(): User
    {
        return Auth::user();
    }
}
