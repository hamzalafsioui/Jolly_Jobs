<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
         DB::table('cities')->insert([
            [
                'name' => 'Casablanca',
                'region' => 'Casablanca-Settat',
                'country' => 'Morocco',
            ],
            [
                'name' => 'Rabat',
                'region' => 'Rabat-Salé-Kénitra',
                'country' => 'Morocco',
            ],
            [
                'name' => 'Marrakech',
                'region' => 'Marrakech-Safi',
                'country' => 'Morocco',
            ],
            [
                'name' => 'Fes',
                'region' => 'Fès-Meknès',
                'country' => 'Morocco',
            ],
            [
                'name' => 'Tangier',
                'region' => 'Tanger-Tétouan-Al Hoceïma',
                'country' => 'Morocco',
            ],
            [
                'name' => 'Agadir',
                'region' => 'Souss-Massa',
                'country' => 'Morocco',
            ],
            [
                'name' => 'Oujda',
                'region' => 'Oriental',
                'country' => 'Morocco',
            ],
            [
                'name' => 'Kenitra',
                'region' => 'Rabat-Salé-Kénitra',
                'country' => 'Morocco',
            ],
            [
                'name' => 'Tetouan',
                'region' => 'Tanger-Tétouan-Al Hoceïma',
                'country' => 'Morocco',
            ],
            [
                'name' => 'Safi',
                'region' => 'Marrakech-Safi',
                'country' => 'Morocco',
            ],
        ]);
    }
}
