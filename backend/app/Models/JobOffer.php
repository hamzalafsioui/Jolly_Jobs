<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class JobOffer extends Model
{
    use HasFactory;

    protected $fillable = [
        'recruiter_id',
        'category_id',
        'city_id',
        'title',
        'description',
        'contract_type',
        'salary_min',
        'salary_max',
        'remote',
        'experience_level',
        'status',
        'views_count',
        'applications_count',
        'image_path',
    ];

    public function recruiter(): BelongsTo
    {
        return $this->belongsTo(Recruiter::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function city(): BelongsTo
    {
        return $this->belongsTo(City::class);
    }

    public function skills(): BelongsToMany
    {
        return $this->belongsToMany(Skill::class, 'job_offer_skill');
    }

    public function applications(): HasMany
    {
        return $this->hasMany(Application::class);
    }

    public function savedByJobSeekers(): BelongsToMany
    {
        return $this->belongsToMany(JobSeeker::class, 'saved_jobs');
    }
}
