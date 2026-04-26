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
                $recruiterUser = $jobOffer->recruiter->user;
                $prefs = $recruiterUser->notification_settings ?? [];

                // Only notify if preference is enabled (default to true if not set)
                if (!isset($prefs['new_application']) || $prefs['new_application']) {
                    $notification = Notification::create([
                        'user_id' => $recruiterUser->id,
                        'type' => 'new_application',
                        'title' => 'New Job Application',
                        'content' => "A new candidate applied for your job offer: {$jobOffer->title}.",
                        'is_read' => false,
                        'data' => [
                            'job_offer_id'   => $jobOffer->id,
                            'application_id' => $application->id,
                        ],
                    ]);

                    broadcast(new NotificationSent($notification));
                }
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
        $application = $this->applicationRepository->findById($id);
        if (!$application) {
            return false;
        }

        $oldStatus = $application->status;
        $data = ['status' => $status];

        if ($status === 'viewed') {
            $data['viewed_at'] = now();
        }

        $updated = $this->applicationRepository->update($id, $data);

        // Notify Job Seeker if status changed significantly
        if ($updated && $oldStatus !== $status && in_array($status, ['shortlisted', 'accepted', 'rejected'])) {
            $this->notifyJobSeekerOfStatusChange($application->fresh(['jobSeeker.user', 'jobOffer']), $status);
        }

        return $updated;
    }

    protected function notifyJobSeekerOfStatusChange(Application $application, string $status): void
    {
        $jobSeekerUser = $application->jobSeeker?->user;
        if (!$jobSeekerUser) {
            return;
        }

        $jobTitle = $application->jobOffer?->title ?? 'a job';
        $statusLabel = ucfirst($status);

        $messages = [
            'shortlisted' => "Good news! You have been shortlisted for the {$jobTitle} position.",
            'accepted'    => "Congratulations! Your application for {$jobTitle} has been Accepted. The recruiter will contact you soon.",
            'rejected'    => "We regret to inform you that your application for {$jobTitle} was not selected at this time.",
        ];

        $prefs = $jobSeekerUser->notification_settings ?? [];

        // Only notify if preference is enabled (default to true if not set)
        if (!isset($prefs['status_update']) || $prefs['status_update']) {
            $notification = Notification::create([
                'user_id' => $jobSeekerUser->id,
                'type' => 'application_status_updated',
                'title' => "Application Update: {$statusLabel}",
                'content' => $messages[$status] ?? "The status of your application for {$jobTitle} has been updated to {$statusLabel}.",
                'is_read' => false,
                'data' => [
                    'job_offer_id' => $application->job_offer_id,
                    'application_id' => $application->id,
                ],
            ]);

            broadcast(new NotificationSent($notification));
        }
    }

    public function getJobSeekerApplications(int $jobSeekerId): Collection
    {
        return $this->applicationRepository->findByJobSeeker($jobSeekerId);
    }

    public function getOfferApplications(int $jobOfferId): Collection
    {
        return $this->applicationRepository->findByJobOffer($jobOfferId);
    }

    public function withdrawApplication(int $id): bool
    {
        $application = $this->applicationRepository->findById($id);
        if (!$application) {
            return false;
        }

        $jobOfferId = $application->job_offer_id;
        $deleted = $this->applicationRepository->delete($id);

        if ($deleted) {
            $jobOffer = $this->jobOfferRepository->findById($jobOfferId);
            if ($jobOffer && $jobOffer->applications_count > 0) {
                $this->jobOfferRepository->update($jobOffer->id, [
                    'applications_count' => $jobOffer->applications_count - 1
                ]);
            }
        }

        return $deleted;
    }
}
