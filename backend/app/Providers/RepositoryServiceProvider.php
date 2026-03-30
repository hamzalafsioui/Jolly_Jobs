<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Repositories\Contracts\UserRepositoryInterface;
use App\Repositories\Eloquent\UserRepository;
use App\Repositories\Contracts\JobOfferRepositoryInterface;
use App\Repositories\Eloquent\JobOfferRepository;
use App\Repositories\Contracts\ApplicationRepositoryInterface;
use App\Repositories\Eloquent\ApplicationRepository;
use App\Repositories\Contracts\CityRepositoryInterface;
use App\Repositories\Eloquent\CityRepository;
use App\Repositories\Contracts\CategoryRepositoryInterface;
use App\Repositories\Eloquent\CategoryRepository;
use App\Repositories\Contracts\JobSeekerRepositoryInterface;
use App\Repositories\Eloquent\JobSeekerRepository;
use App\Repositories\Contracts\RecruiterRepositoryInterface;
use App\Repositories\Eloquent\RecruiterRepository;
use App\Repositories\Contracts\SkillRepositoryInterface;
use App\Repositories\Eloquent\SkillRepository;
use App\Repositories\Contracts\EducationRepositoryInterface;
use App\Repositories\Eloquent\EducationRepository;
use App\Repositories\Contracts\ExperienceRepositoryInterface;
use App\Repositories\Eloquent\ExperienceRepository;


class RepositoryServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(UserRepositoryInterface::class, UserRepository::class);
        $this->app->bind(JobOfferRepositoryInterface::class, JobOfferRepository::class);
        $this->app->bind(ApplicationRepositoryInterface::class, ApplicationRepository::class);
        $this->app->bind(CityRepositoryInterface::class, CityRepository::class);
        $this->app->bind(CategoryRepositoryInterface::class, CategoryRepository::class);
        $this->app->bind(JobSeekerRepositoryInterface::class, JobSeekerRepository::class);
        $this->app->bind(RecruiterRepositoryInterface::class, RecruiterRepository::class);
        $this->app->bind(SkillRepositoryInterface::class, SkillRepository::class);
        $this->app->bind(EducationRepositoryInterface::class, EducationRepository::class);
        $this->app->bind(ExperienceRepositoryInterface::class, ExperienceRepository::class);
        
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
