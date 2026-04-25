<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Models\City;
use App\Repositories\Contracts\CityRepositoryInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CityController extends Controller
{
    public function __construct(
        private readonly CityRepositoryInterface $cityRepository
    ) {}

    public function index(Request $request): JsonResponse
    {
        $cities = $this->cityRepository->all();
        return ApiResponse::success($cities);
    }

    public function store(Request $request): JsonResponse
    {
        if ($request->user()->cannot('create', City::class) && $request->user()->role !== 'admin') {
            return ApiResponse::forbidden('You are not authorized to create a city.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:cities,name',
            'region' => 'nullable|string|max:255',
            'country' => 'nullable|string|max:255',
        ]);

        $city = $this->cityRepository->create($validated);
        return ApiResponse::created($city, 'City added successfully.');
    }

    public function update(Request $request, $id): JsonResponse
    {
        $city = $this->cityRepository->findById($id);
        if (!$city) {
            return ApiResponse::notFound('City not found.');
        }

        if ($request->user()->cannot('update', $city) && $request->user()->role !== 'admin') {
            return ApiResponse::forbidden('You are not authorized to update this city.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:cities,name,' . $id,
            'region' => 'nullable|string|max:255',
            'country' => 'nullable|string|max:255',
        ]);

        $updated = $this->cityRepository->update($id, $validated);
        if (!$updated) {
            return ApiResponse::serverError('Failed to update city.');
        }

        $city = $this->cityRepository->findById($id);
        return ApiResponse::updated($city, 'City updated successfully.');
    }

    public function destroy(Request $request, $id): JsonResponse
    {
        $city = $this->cityRepository->findById($id);
        if (!$city) {
            return ApiResponse::notFound('City not found.');
        }

        if ($request->user()->cannot('delete', $city) && $request->user()->role !== 'admin') {
            return ApiResponse::forbidden('You are not authorized to delete this city.');
        }

        $deleted = $this->cityRepository->delete($id);
        if (!$deleted) {
            return ApiResponse::serverError('Failed to delete city.');
        }

        return ApiResponse::deleted('City deleted successfully.');
    }
}
