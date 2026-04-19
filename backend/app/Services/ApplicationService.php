<?php

namespace App\Services;

use App\Repositories\Contracts\ApplicationRepositoryInterface;
use App\Repositories\Contracts\JobOfferRepositoryInterface;
use App\Models\Application;
use Illuminate\Support\Collection;
use App\Events\NotificationSent;
use App\Models\Notification;

class ApplicationService
{
    protected $applicationRepository;
    protected $jobOfferRepository;

    public function __construct(
        ApplicationRepositoryInterface $applicationRepository,
        JobOfferRepositoryInterface $jobOfferRepository
    ) {
        $this->applicationRepository = $applicationRepository;
        $this->jobOfferRepository = $jobOfferRepository;
    }

    public function apply(array $data): Application
    {
        $application = $this->applicationRepository->create($data);
        
        // Increment applications_count on job offer
        $jobOffer = $this->jobOfferRepository->findById($data['job_offer_id']);
        if ($jobOffer) {
            $this->jobOfferRepository->update($jobOffer->id, [
                'applications_count' => $jobOffer->applications_count + 1
            ]);

            if ($jobOffer->recruiter && $jobOffer->recruiter->user) {
                $notification = Notification::create([
                    'user_id' => $jobOffer->recruiter->user->id,
                    'type' => 'new_application',
                    'title' => 'New Job Application',
                    'content' => "A new candidate applied for your job offer: {$jobOffer->title}.",
                    'is_read' => false,
                ]);

                broadcast(new NotificationSent($notification));
            }
        }

        return $application;
    }

    public function getApplication(int $id): ?Application
    {
        return $this->applicationRepository->findById($id);
    }

    public function updateStatus(int $id, string $status): bool
    {
        $data = ['status' => $status];
        if ($status === 'viewed') {
            $data['viewed_at'] = now();
        }
        return $this->applicationRepository->update($id, $data);
    }

    public function getJobSeekerApplications(int $jobSeekerId): Collection
    {
        return $this->applicationRepository->findByJobSeeker($jobSeekerId);
    }

    public function getOfferApplications(int $jobOfferId): Collection
    {
        return $this->applicationRepository->findByJobOffer($jobOfferId);
    }
}
