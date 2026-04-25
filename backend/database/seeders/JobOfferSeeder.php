<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\City;
use App\Models\JobOffer;
use App\Models\Recruiter;
use Illuminate\Database\Seeder;
use Illuminate\Support\Arr;
use App\Models\Skill;

class JobOfferSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $recruiters = Recruiter::all();
        $categories = Category::all();
        $cities = City::all();

        if ($recruiters->isEmpty() || $categories->isEmpty() || $cities->isEmpty()) {
            $this->command->warn('Recruiters, categories, or cities are missing. Please seed them first.');
            return;
        }

        $jobTitles = [
            'Software Engineer',
            'Frontend Developer',
            'Backend Developer',
            'Fullstack Developer',
            'UI/UX Designer',
            'Product Manager',
            'Data Scientist',
            'Marketing Specialist',
            'Accountant',
            'Sales Representative',
            'Customer Success Manager',
            'DevOps Engineer',
            'HR Manager',
            'Graphic Designer',
            'Mobile App Developer',
            'Quality Assurance Engineer',
            'Business Analyst',
            'Systems Administrator',
            'Network Engineer',
            'Social Media Manager'
        ];

        $skills = Skill::all();

        foreach (range(1, 50) as $index) {
            $title = Arr::random($jobTitles);
            $contractType = Arr::random(JobOffer::CONTRACT_TYPES);
            $city = $cities->random();
            $category = $categories->random();
            $recruiter = $recruiters->random();
            $isRemote = fake()->boolean(30); // 30% chance of remote

            $jobOffer = JobOffer::create([
                'recruiter_id' => $recruiter->id,
                'category_id' => $category->id,
                'city_id' => $city->id,
                'title' => $title,
                'description' => fake()->paragraphs(5, true),
                'contract_type' => $contractType,
                'salary_min' => fake()->numberBetween(35, 65),
                'salary_max' => fake()->numberBetween(70, 150),
                'remote' => $isRemote,
                'experience_level' => fake()->randomElement(['Junior (0-2 years)', 'Mid-Level (3-5 years)', 'Senior (5+ years)', 'Expert (10+ years)']),
                'status' => 'active',
                'views_count' => fake()->numberBetween(50, 1500),
                'applications_count' => fake()->numberBetween(5, 80),
            ]);

            // Attach 3-6 random skills to each job offer
            $jobOffer->skills()->attach(
                $skills->random(rand(5, 8))->pluck('id')->toArray()
            );
        }
    }
}
