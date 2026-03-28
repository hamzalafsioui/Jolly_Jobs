<?php

namespace App\Repositories\Eloquent;

use App\Models\Skill;
use App\Repositories\Contracts\SkillRepositoryInterface;
use Illuminate\Support\Collection;

class SkillRepository implements SkillRepositoryInterface
{
    public function all(): Collection
    {
        return Skill::all();
    }

    public function findById(int $id): ?Skill
    {
        return Skill::find($id);
    }

    public function findByName(string $name): ?Skill
    {
        return Skill::where('name', $name)->first();
    }
}
