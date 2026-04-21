<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\JobSeeker;
use Illuminate\Support\Facades\Hash;
use App\Models\Skill;

class JobSeekerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        // create users with job_seeker role
        $users = User::factory()->count(10)->create([
            'password'=> Hash::make('password123'),
            'role' => 'job_seeker'
        ]);

        $skills = Skill::all();

        foreach ($users as $user) {
            $jobSeeker = JobSeeker::create([
                'user_id' => $user->id,
                'specialty' => fake()->randomElement(['Frontend', 'Backend', 'Full Stack']),
                'experience_level' => fake()->randomElement(['Junior', 'Mid', 'Senior']),
                'cv_path' => null,
            ]);

            // Attach 4-8 random skills to each job seeker
            $jobSeeker->skills()->attach(
                $skills->random(rand(4, 8))->pluck('id')->toArray()
            );
        }
    }
}
