<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Skill;
use App\Models\Category;

class SkillSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = Category::all()->keyBy('name');

        $skills = [
            // IT Category
            ['name' => 'PHP', 'category' => 'IT'],
            ['name' => 'Laravel', 'category' => 'IT'],
            ['name' => 'JavaScript', 'category' => 'IT'],
            ['name' => 'React', 'category' => 'IT'],
            ['name' => 'Vue.js', 'category' => 'IT'],
            ['name' => 'Node.js', 'category' => 'IT'],
            ['name' => 'Python', 'category' => 'IT'],
            ['name' => 'Django', 'category' => 'IT'],
            ['name' => 'Docker', 'category' => 'IT'],
            ['name' => 'Kubernetes', 'category' => 'IT'],
            ['name' => 'SQL', 'category' => 'IT'],
            ['name' => 'MongoDB', 'category' => 'IT'],
            ['name' => 'AWS', 'category' => 'IT'],
            ['name' => 'Azure', 'category' => 'IT'],
            ['name' => 'CSS', 'category' => 'IT'],
            ['name' => 'HTML', 'category' => 'IT'],
            ['name' => 'TypeScript', 'category' => 'IT'],
            ['name' => 'Swift', 'category' => 'IT'],
            ['name' => 'Kotlin', 'category' => 'IT'],

            // Finance Category
            ['name' => 'Accounting', 'category' => 'Finance'],
            ['name' => 'Financial Analysis', 'category' => 'Finance'],
            ['name' => 'Auditing', 'category' => 'Finance'],
            ['name' => 'Tax Preparation', 'category' => 'Finance'],
            ['name' => 'Investment Management', 'category' => 'Finance'],
            ['name' => 'Excel VBA', 'category' => 'Finance'],
            ['name' => 'SAP', 'category' => 'Finance'],
            ['name' => 'Risk Management', 'category' => 'Finance'],

            // Design Category
            ['name' => 'UI/UX Design', 'category' => 'Design'],
            ['name' => 'Adobe Photoshop', 'category' => 'Design'],
            ['name' => 'Adobe Illustrator', 'category' => 'Design'],
            ['name' => 'Figma', 'category' => 'Design'],
            ['name' => 'Sketch', 'category' => 'Design'],
            ['name' => '3D Modeling', 'category' => 'Design'],
            ['name' => 'Typography', 'category' => 'Design'],
            ['name' => 'Branding', 'category' => 'Design'],

            // Marketing Category
            ['name' => 'SEO', 'category' => 'Marketing'],
            ['name' => 'Content Marketing', 'category' => 'Marketing'],
            ['name' => 'Social Media Management', 'category' => 'Marketing'],
            ['name' => 'Google Ads', 'category' => 'Marketing'],
            ['name' => 'Email Marketing', 'category' => 'Marketing'],
            ['name' => 'Market Research', 'category' => 'Marketing'],
            ['name' => 'Copywriting', 'category' => 'Marketing'],
            ['name' => 'Public Relations', 'category' => 'Marketing'],

            // General/Soft Skills (Uncategorized)
            ['name' => 'Project Management', 'category' => 'Uncategorized'],
            ['name' => 'Communication', 'category' => 'Uncategorized'],
            ['name' => 'Problem Solving', 'category' => 'Uncategorized'],
            ['name' => 'Leadership', 'category' => 'Uncategorized'],
            ['name' => 'Teamwork', 'category' => 'Uncategorized'],
            ['name' => 'Time Management', 'category' => 'Uncategorized'],
        ];

        foreach ($skills as $skillData) {
            $categoryName = $skillData['category'];
            $categoryId = isset($categories[$categoryName]) ? $categories[$categoryName]->id : null;

            Skill::firstOrCreate([
                'name' => $skillData['name'],
                'category_id' => $categoryId
            ]);
        }
    }
}
