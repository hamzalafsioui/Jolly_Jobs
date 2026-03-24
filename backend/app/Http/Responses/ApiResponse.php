<?php

namespace App\Http\Responses;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Http\Resources\Json\ResourceCollection;
use Illuminate\Support\MessageBag;

/**
 * ApiResponse
 *
 * Every endpoint should return a response built by
 * this class so the client always receives the same envelope:
 *
 *  {
 *    "success": true|false,
 *    "message": "...",
 *    "data": {...}|[...]|null,   // present on success
 *    "errors": {...}|null,       // present on failure
 *    "meta": {...}|null          // optional pagination / extra metadata
 *  }
 */
class ApiResponse
{

    public static function success(
        mixed $data = null,
        string $message = 'Request successful.',
        ?array $meta = null,
        int $statusCode = 200
    ): JsonResponse {
        return self::buildSuccess($data, $message, $meta, $statusCode);
    }

    public static function created(
        mixed $data = null,
        string $message = 'Resource created successfully.'
    ): JsonResponse {
        return self::buildSuccess($data, $message, null, 201);
    }


    public static function updated(
        mixed $data = null,
        string $message = 'Resource updated successfully.'
    ): JsonResponse {
        return self::buildSuccess($data, $message, null, 200);
    }

    public static function deleted(
        string $message = 'Resource deleted successfully.'
    ): JsonResponse {
        return self::buildSuccess(null, $message, null, 200);
    }


   


    public static function badRequest(
        string $message = 'Bad request.',
        mixed $errors = null
    ): JsonResponse {
        return self::buildError($message, $errors, 400);
    }


    public static function unauthorized(
        string $message = 'Unauthorized. Please log in to continue.'
    ): JsonResponse {
        return self::buildError($message, null, 401);
    }


    public static function forbidden(
        string $message = 'Forbidden. You do not have permission to perform this action.'
    ): JsonResponse {
        return self::buildError($message, null, 403);
    }

    public static function notFound(
        string $message = 'Resource not found.'
    ): JsonResponse {
        return self::buildError($message, null, 404);
    }



    public static function tooManyRequests(
        string $message = 'Too many requests. Please slow down and try again later.'
    ): JsonResponse {
        return self::buildError($message, null, 429);
    }

   

   // ============================ Private ===================================

    /**
     * Build the standardised success envelope
     */
    private static function buildSuccess(
        mixed $data,
        string $message,
        ?array $meta,
        int $statusCode
    ): JsonResponse {

        if ($data instanceof JsonResource) {
            $data = $data->toArray(request());
        }

        $payload = [
            'success' => true,
            'message' => $message,
            'data'    => $data,
        ];

        if ($meta !== null) {
            $payload['meta'] = $meta;
        }

        return response()->json($payload, $statusCode);
    }

    /**
     * Build the standardised error envelope
     */
    private static function buildError(
        string $message,
        mixed $errors,
        int $statusCode
    ): JsonResponse {
        $payload = [
            'success' => false,
            'message' => $message,
            'errors'  => $errors,
        ];

        return response()->json($payload, $statusCode);
    }
}
