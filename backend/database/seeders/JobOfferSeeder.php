<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\City;
use App\Models\JobOffer;
use App\Models\Recruiter;
use Illuminate\Database\Seeder;
use Illuminate\Support\Arr;

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

        foreach (range(1, 40) as $index) {
            $title = Arr::random($jobTitles);
            $contractType = Arr::random(JobOffer::CONTRACT_TYPES);
            $city = $cities->random();
            $category = $categories->random();
            $recruiter = $recruiters->random();
            $isRemote = fake()->boolean(20); // 20% chance of remote

            JobOffer::create([
                'recruiter_id' => $recruiter->id,
                'category_id' => $category->id,
                'city_id' => $city->id,
                'title' => $title,
                'description' => fake()->paragraphs(3, true),
                'contract_type' => $contractType,
                'salary_min' => fake()->numberBetween(30, 60),
                'salary_max' => fake()->numberBetween(70, 120),
                'remote' => $isRemote,
                'experience_level' => fake()->randomElement(['Junior', 'Intermediate', 'Senior', 'Expert']),
                'status' => 'active',
                'views_count' => fake()->numberBetween(0, 500),
                'applications_count' => fake()->numberBetween(0, 50),
            ]);
        }
    }
}
