<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Skill;
use App\Http\Responses\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SkillController extends Controller
{
    public function index(): JsonResponse
    {
        return ApiResponse::success(Skill::with('category')->get());
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:skills',
            'category_id' => 'nullable|exists:categories,id',
        ]);

        $skill = Skill::create($validated);

        return ApiResponse::created($skill, 'Skill created successfully');
    }

    public function update(Request $request, Skill $skill): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:skills,name,' . $skill->id,
            'category_id' => 'nullable|exists:categories,id',
        ]);

        $skill->update($validated);

        return ApiResponse::success($skill, 'Skill updated successfully');
    }

    public function destroy(Skill $skill): JsonResponse
    {
        $skill->delete();
        return ApiResponse::success(null, 'Skill deleted successfully');
    }
}
