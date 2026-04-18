<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        Category::insert([
            [
                'name' => 'IT',
                'icon' => 'Laptop' 
            ],
            [
                'name' => 'Finance',
                'icon' => 'DollarSign'
            ],
            [
                'name' => 'Design',
                'icon' => 'Palette'
            ],
            [
                'name' => 'Marketing',
                'icon' => 'Megaphone'
            ],
            [
                'name' => 'Uncategorized',
                'icon' => 'HelpCircle'
            ],
        ]);
    }
}
