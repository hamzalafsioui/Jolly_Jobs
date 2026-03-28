<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Recruiter;
use Illuminate\Support\Facades\Hash;

class RecruiterSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        // create users with recruiter role
        $users = User::factory()->count(5)->create([
            'password'=> Hash::make('password123'),
            'role' => 'recruiter'
        ]);

        foreach ($users as $user) {
            Recruiter::create([
                'user_id' => $user->id,
                'company_name' => fake()->company(),
                'company_size' => fake()->randomElement(['1-10', '11-50', '51-200', '200+']),
                'industry' => fake()->randomElement(['IT', 'Finance', 'Healthcare']),
                'website' => fake()->url(),
                'logo' => null,
                'description' => fake()->paragraph(),
            ]);
        }
    }
}
