<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class JobSeeker extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'specialty',
        'experience_level',
        'cv_path',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function skills(): BelongsToMany
    {
        return $this->belongsToMany(Skill::class, 'job_seeker_skill');
    }

    public function educations(): HasMany
    {
        return $this->hasMany(Education::class);
    }

    public function experiences(): HasMany
    {
        return $this->hasMany(Experience::class);
    }

    public function applications(): HasMany
    {
        return $this->hasMany(Application::class);
    }

    public function savedJobs(): BelongsToMany
    {
        return $this->belongsToMany(JobOffer::class, 'saved_jobs');
    }
}
