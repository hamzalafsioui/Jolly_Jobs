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
                'name' => 'casablanca',
                'region' => 'Casablanca-Settat',
                'country' => 'Morocco',
            ],
            [
                'name' => 'rabat',
                'region' => 'Rabat-Salé-Kénitra',
                'country' => 'Morocco',
            ],
            [
                'name' => 'marrakech',
                'region' => 'Marrakech-Safi',
                'country' => 'Morocco',
            ],
            [
                'name' => 'fes',
                'region' => 'Fès-Meknès',
                'country' => 'Morocco',
            ],
            [
                'name' => 'tangier',
                'region' => 'Tanger-Tétouan-Al Hoceïma',
                'country' => 'Morocco',
            ],
            [
                'name' => 'agadir',
                'region' => 'Souss-Massa',
                'country' => 'Morocco',
            ],
            [
                'name' => 'oujda',
                'region' => 'Oriental',
                'country' => 'Morocco',
            ],
            [
                'name' => 'kenitra',
                'region' => 'Rabat-Salé-Kénitra',
                'country' => 'Morocco',
            ],
            [
                'name' => 'tetouan',
                'region' => 'Tanger-Tétouan-Al Hoceïma',
                'country' => 'Morocco',
            ],
            [
                'name' => 'safi',
                'region' => 'Marrakech-Safi',
                'country' => 'Morocco',
            ],
        ]);
    }
}
