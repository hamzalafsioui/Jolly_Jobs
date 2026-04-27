<?php

namespace App\Services;

use App\Models\Skill;
use Smalot\PdfParser\Parser;
use Exception;
use Illuminate\Support\Facades\Log;

class CvParsingService
{
    /**
     * Extract text from a PDF file.
     */
    public function extractTextFromPdf(string $filePath): string
    {
        try {
            if (!file_exists($filePath)) {
                throw new Exception("File not found: " . $filePath);
            }

            $parser = new Parser();
            $pdf = $parser->parseFile($filePath);

            $text = $pdf->getText();
            return $text;
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * Match text against existing skills in the database.
     */
    public function scanSkills(string $text): array
    {
        
        $allSkills = Skill::all();
        $foundSkills = [];

        // convert text to lowercase
        $normalizedText = strtolower($text);

        foreach ($allSkills as $skill) {
            $skillName = strtolower($skill->name);

            // if skill found in text
            if (stripos($normalizedText, $skillName) !== false) {
                $foundSkills[] = [
                    'id' => $skill->id,
                    'name' => $skill->name,
                ];
            }
        }

        return $foundSkills;
    }
}
