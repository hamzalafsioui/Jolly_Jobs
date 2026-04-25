<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Recruiter;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Arr;

class RecruiterSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        // create users with recruiter role
        $users = User::factory()->count(8)->create([
            'password' => Hash::make('password123'),
            'role' => 'recruiter'
        ]);


        $photos = ['photos/person1.png', 'photos/person2.jpg', 'photos/person3.jpg'];
        $logos = ['logos/logo1.jpg', 'logos/logo2.jpg', 'logos/logo3.jpg'];

        foreach ($users as $user) {
            $logo = Arr::random($logos);
            $user->update(['photo' => Arr::random($photos)]);

            Recruiter::create([
                'user_id' => $user->id,
                'company_name' => fake()->company(),
                'company_size' => fake()->randomElement(['1-10', '11-50', '51-200', '200-500', '500+']),
                'industry' => fake()->randomElement(['Software Development', 'Financial Services', 'E-commerce', 'HealthTech', 'Cybersecurity', 'Cloud Computing']),
                'website' => fake()->url(),
                'logo' => $logo,
                'description' => fake()->paragraphs(3, true),
            ]);
        }
    }
}
