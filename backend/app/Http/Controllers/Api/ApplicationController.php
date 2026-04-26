<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Application\StoreApplicationRequest;
use App\Http\Requests\Application\UpdateApplicationStatusRequest;
use App\Http\Resources\ApplicationResource;
use App\Http\Responses\ApiResponse;
use App\Services\ApplicationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use App\Models\Application;
use App\Models\JobOffer;

class ApplicationController extends Controller
{
    public function __construct(
        private readonly ApplicationService $applicationService
    ) {}

    public function apply(StoreApplicationRequest $request): JsonResponse
    {
        if ($request->user()->cannot('create', Application::class)) {
            return ApiResponse::forbidden('Only candidates with a job-seeker profile can apply.');
        }

        $data = $request->validated();
        $data['job_seeker_id'] = $request->user()->jobSeeker->id;
        $data['status'] = 'sent';

        $application = $this->applicationService->apply($data);
        return ApiResponse::created(new ApplicationResource($application), 'Application submitted successfully.');
    }

    public function show($id): JsonResponse
    {
        $application = $this->applicationService->getApplication($id);
        if (!$application) {
            return ApiResponse::notFound('Application not found.');
        }

        if (request()->user()->cannot('view', $application)) {
            return ApiResponse::forbidden('You are not authorized to view this application.');
        }

        return ApiResponse::success(new ApplicationResource($application));
    }

    public function updateStatus(UpdateApplicationStatusRequest $request, $id): JsonResponse
    {
        $application = $this->applicationService->getApplication($id);
        if (!$application) {
            return ApiResponse::notFound('Application not found.');
        }

        if ($request->user()->cannot('update', $application)) {
            return ApiResponse::forbidden('You are not authorized to update this application.');
        }

        $updated = $this->applicationService->updateStatus($id, $request->status);
        if (!$updated) {
            return ApiResponse::serverError('Update failed.');
        }

        $application = $this->applicationService->getApplication($id);
        return ApiResponse::updated(new ApplicationResource($application), 'Application status updated successfully.');
    }

    public function jobSeekerApplications($jobSeekerId): JsonResponse
    {
        $user = request()->user();
        if ($user->role !== 'admin' && (!$user->jobSeeker || $user->jobSeeker->id != $jobSeekerId)) {
            return ApiResponse::forbidden('You can only view your own applications.');
        }

        $applications = $this->applicationService->getJobSeekerApplications($jobSeekerId);
        return ApiResponse::success(ApplicationResource::collection($applications));
    }

    public function offerApplications($jobOfferId): JsonResponse
    {
        $jobOffer = JobOffer::find($jobOfferId);
        if (!$jobOffer) {
            return ApiResponse::notFound('Job offer not found.');
        }

        if (request()->user()->cannot('viewApplications', $jobOffer)) {
            return ApiResponse::forbidden('You are not authorized to view applications for this job offer.');
        }

        $applications = $this->applicationService->getOfferApplications($jobOfferId);
        return ApiResponse::success(ApplicationResource::collection($applications));
    }

    public function downloadCvFile($id): JsonResponse
    {
        $application = $this->applicationService->getApplication($id);
        if (!$application || !$application->cv_path) {
            return ApiResponse::notFound('CV not found.');
        }

        $path = storage_path('app/public/' . $application->cv_path);

        if (!file_exists($path)) {
            return ApiResponse::notFound('CV file not found on disk.');
        }

        $content = file_get_contents($path);
        $base64 = base64_encode($content);

        return ApiResponse::success([
            'base64' => $base64,
            'mime'   => 'application/pdf'
        ], 'CV retrieved successfully.');
    }

    public function destroy($id): JsonResponse
    {
        $application = $this->applicationService->getApplication($id);
        if (!$application) {
            return ApiResponse::notFound('Application not found.');
        }

        if (request()->user()->cannot('delete', $application)) {
            return ApiResponse::forbidden('You are not authorized to delete this application.');
        }

        $deleted = $this->applicationService->withdrawApplication($id);
        if (!$deleted) {
            return ApiResponse::serverError('Delete failed.');
        }

        return ApiResponse::deleted('Application withdrawn successfully.');
    }
}

