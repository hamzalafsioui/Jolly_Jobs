<?php

namespace App\Services;

use App\Repositories\Contracts\CityRepositoryInterface;
use Illuminate\Support\Collection;

class CityService
{

    public function __construct(
        private readonly CityRepositoryInterface $cityRepository
    ) {}

    /**
     * Search for cities based on a query string
     */
    public function searchCities(string $query): Collection
    {
        return $this->cityRepository->search($query);
    }

    /**
     * Get all cities
     */
    public function getAllCities(): Collection
    {
        return $this->cityRepository->all();
    }
}
