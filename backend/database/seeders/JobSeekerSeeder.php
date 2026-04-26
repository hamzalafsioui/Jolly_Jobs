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
        $users = User::factory()->count(15)->create([
            'password'=> Hash::make('password123'),
            'role' => 'job_seeker'
        ]);

        $skills = Skill::all();
    

        $photos = ['photos/person1.png', 'photos/person2.jpg', 'photos/person3.jpg'];
        $i = 0;

        foreach ($users as $user) {
            $user->update([
                'photo' => $photos[$i % 3],
                'bio' => fake()->paragraphs(2, true),
            ]);

            $jobSeeker = JobSeeker::create([
                'user_id' => $user->id,
                'specialty' => fake()->randomElement([
                    'Frontend Developer (React/Vue)', 
                    'Backend Engineer (Laravel/Node)', 
                    'Full Stack Developer',
                    'Mobile Developer (Flutter/React Native)',
                    'UI/UX Product Designer',
                    'DevOps & Infrastructure',
                    'Data Analyst',
                    'Marketing Specialist'
                ]),
                'experience_level' => fake()->randomElement(['Junior (0-2 years)', 'Mid-Level (3-5 years)', 'Senior (5+ years)', 'Lead / Principal']),
                'cv_path' => null,
            ]);

            // Attach 6-10 random skills to each job seeker
            $jobSeeker->skills()->attach(
                $skills->random(rand(6, 10))->pluck('id')->toArray()
            );
            $i++;
        }
    }
}
