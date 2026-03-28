<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\StoreUserRequest;
use App\Http\Requests\User\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Http\Responses\ApiResponse;
use App\Repositories\Contracts\UserRepositoryInterface;
use Illuminate\Http\JsonResponse;

class UserController extends Controller
{
    public function __construct(
        private readonly UserRepositoryInterface $userRepository
    ) {}

    public function index(): JsonResponse
    {
        $users = $this->userRepository->all();
        return ApiResponse::success(UserResource::collection($users));
    }

    public function show($id): JsonResponse
    {
        $user = $this->userRepository->findById($id);
        if (!$user) {
            return ApiResponse::notFound('User not found.');
        }
        return ApiResponse::success(new UserResource($user));
    }

    public function store(StoreUserRequest $request): JsonResponse
    {
        $user = $this->userRepository->create($request->validated());
        return ApiResponse::created(new UserResource($user), 'User created successfully.');
    }

    public function update(UpdateUserRequest $request, $id): JsonResponse
    {
        $user = $this->userRepository->findById($id);
        if (!$user) {
            return ApiResponse::notFound('User not found.');
        }

        if ($request->user()->cannot('update', $user)) {
            return ApiResponse::forbidden('You are not authorized to update this profile.');
        }

        $updated = $this->userRepository->update($id, $request->validated());
        if (!$updated) {
            return ApiResponse::serverError('Update failed.');
        }

        $user = $this->userRepository->findById($id);
        return ApiResponse::updated(new UserResource($user), 'User updated successfully.');
    }

    public function destroy($id): JsonResponse
    {
        $user = $this->userRepository->findById($id);
        if (!$user) {
            return ApiResponse::notFound('User not found.');
        }

        if (request()->user()->cannot('delete', $user)) {
            return ApiResponse::forbidden('You are not authorized to delete this user.');
        }

        $deleted = $this->userRepository->delete($id);
        if (!$deleted) {
            return ApiResponse::serverError('Delete failed.');
        }

        return ApiResponse::deleted('User deleted successfully.');
    }
}
