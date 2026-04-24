<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class TrimAndStripTags
{
    /**
     * Routes that should NOT have their input sanitized.
     * Prevents mangling OAuth authorization codes, binary file data, etc.
     */
    protected array $except = [
        'api/auth/google/callback',
    ];

    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Skip sanitization for excepted routes (e.g. OAuth callbacks)
        foreach ($this->except as $pattern) {
            if ($request->is($pattern)) {
                return $next($request);
            }
        }

        $input = $request->all();

        // Recursively clean string values only => skip files, integers, booleans, etc.
        array_walk_recursive($input, function (&$item) {
            if (is_string($item)) {
                $item = strip_tags($item);
                $item = trim($item);
            }
        });

        $request->merge($input);

        return $next($request);
    }
}
