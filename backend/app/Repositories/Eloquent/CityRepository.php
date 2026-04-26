<?php

namespace App\Repositories\Eloquent;

use App\Models\City;
use App\Repositories\Contracts\CityRepositoryInterface;
use Illuminate\Support\Collection;

class CityRepository implements CityRepositoryInterface
{
    public function all(): Collection
    {
        return City::all();
    }

    public function findById(int $id): ?City
    {
        return City::find($id);
    }

    public function search(string $query): Collection
    {
        if (empty($query)) {
            return $this->all();
        }
        
        return City::where('name', 'ILIKE', '%' . $query . '%')->get(['id', 'name']);
    }

    public function create(array $data): City
    {
        return City::create($data);
    }

    public function update(int $id, array $data): bool
    {
        $city = City::find($id);
        if (!$city) return false;
        return $city->update($data);
    }

    public function delete(int $id): bool
    {
        $city = City::find($id);
        if (!$city) return false;
        return $city->delete();
    }
}
