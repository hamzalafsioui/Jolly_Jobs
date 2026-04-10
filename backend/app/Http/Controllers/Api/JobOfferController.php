<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\JobOffer\StoreJobOfferRequest;
use App\Http\Requests\JobOffer\UpdateJobOfferRequest;
use App\Http\Resources\JobOfferResource;
use App\Http\Responses\ApiResponse;
use App\Repositories\Contracts\JobOfferRepositoryInterface;
use App\Services\CityService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Models\JobOffer;

class JobOfferController extends Controller
{
    public function __construct(
        private readonly JobOfferRepositoryInterface $jobOfferRepository,
        private readonly CityService $cityService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $perPage = $request->get('limit', 15);
        if ($request->hasAny(['category_id', 'city_id', 'contract_type', 'keyword'])) {
            $offers = $this->jobOfferRepository->search($request->all(), $perPage);
        } else {
            $offers = $this->jobOfferRepository->all($perPage);
        }
        
        return ApiResponse::paginated(JobOfferResource::collection($offers));
    }

    public function show($id): JsonResponse
    {
        $offer = $this->jobOfferRepository->findById($id);
        if (!$offer) {
            return ApiResponse::notFound('Job offer not found.');
        }
        return ApiResponse::success(new JobOfferResource($offer));
    }

    public function store(StoreJobOfferRequest $request): JsonResponse
    {
        if ($request->user()->cannot('create', JobOffer::class)) {
            return ApiResponse::forbidden('Only employers can create job offers.');
        }

        $offer = $this->jobOfferRepository->create($request->validated())->load('recruiter');
        return ApiResponse::created(new JobOfferResource($offer), 'Job offer created successfully.');
    }

    public function update(UpdateJobOfferRequest $request, $id): JsonResponse
    {
        $offer = $this->jobOfferRepository->findById($id);
        if (!$offer) {
            return ApiResponse::notFound('Job offer not found.');
        }

        if ($request->user()->cannot('update', $offer)) {
            return ApiResponse::forbidden('You are not authorized to update this job offer.');
        }

        $updated = $this->jobOfferRepository->update($id, $request->validated());
        if (!$updated) {
            return ApiResponse::serverError('Update failed.');
        }

        $offer = $this->jobOfferRepository->findById($id);
        return ApiResponse::updated(new JobOfferResource($offer), 'Job offer updated successfully.');
    }

    public function destroy($id): JsonResponse
    {
        $offer = $this->jobOfferRepository->findById($id);
        if (!$offer) {
            return ApiResponse::notFound('Job offer not found.');
        }

        if (request()->user()->cannot('delete', $offer)) {
            return ApiResponse::forbidden('You are not authorized to delete this job offer.');
        }

        $deleted = $this->jobOfferRepository->delete($id);
        if (!$deleted) {
            return ApiResponse::serverError('Delete failed.');
        }

        return ApiResponse::deleted('Job offer deleted successfully.');
    }

    public function latest(Request $request): JsonResponse
    {
        $limit = $request->get('limit', 10);
        $offers = $this->jobOfferRepository->getLatest($limit);
        return ApiResponse::success(JobOfferResource::collection($offers));
    }

    public function toggleSave(Request $request, $id): JsonResponse
    {
        $user = $request->user();
        if ($user->role !== 'job_seeker') {
            return ApiResponse::forbidden('Only job seekers can save job offers.');
        }

        if (!$user->jobSeeker) {
            return ApiResponse::forbidden('Your account is missing a job seeker profile. Please contact support.');
        }

        $result = $this->jobOfferRepository->toggleSave($id, $user->jobSeeker->id);

        if ($result['status'] === 'not_found') {
            return ApiResponse::notFound('Job offer not found.');
        }

        $message = $result['attached'] ? 'Job offer saved successfully.' : 'Job offer removed from saved list.';
        return ApiResponse::success(['is_saved' => $result['attached']], $message);
    }

    public function savedJobs(Request $request): JsonResponse
    {
        $user = $request->user();
        if ($user->role !== 'job_seeker') {
            return ApiResponse::forbidden('Only job seekers have saved jobs.');
        }

        if (!$user->jobSeeker) {
            return ApiResponse::forbidden('Your account is missing a job seeker profile.');
        }

        $perPage = $request->get('limit', 15);
        $offers = $this->jobOfferRepository->getSavedJobs($user->jobSeeker->id, $perPage);

        return ApiResponse::paginated(JobOfferResource::collection($offers));
    }

    public function contractTypes(): JsonResponse
    {
        return ApiResponse::success(JobOffer::CONTRACT_TYPES);
    }

    public function cities(Request $request): JsonResponse
    {
        $query = (string) $request->get('query', '');
        $cities = $this->cityService->searchCities($query);

        return ApiResponse::success($cities);
    }

    public function jobTitleSuggestions(Request $request): JsonResponse
    {
        $query = $request->get('query', '');
        $suggestions = $this->jobOfferRepository->getJobTitleSuggestions($query);

        return ApiResponse::success($suggestions);
    }
}
