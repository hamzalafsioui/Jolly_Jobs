<?php

namespace App\Repositories\Contracts;

use App\Models\Skill;
use Illuminate\Support\Collection;

interface SkillRepositoryInterface
{
    public function all(): Collection;
    public function findById(int $id): ?Skill;
    public function findByName(string $name): ?Skill;
}
