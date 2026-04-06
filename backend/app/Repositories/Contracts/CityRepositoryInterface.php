<?php

namespace App\Repositories\Contracts;

use App\Models\City;
use Illuminate\Support\Collection;

interface CityRepositoryInterface
{
    public function all(): Collection;
    public function findById(int $id): ?City;
    public function search(string $query): Collection;
}
