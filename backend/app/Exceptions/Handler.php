<?php

namespace App\Exceptions;

use App\Http\Responses\ApiResponse;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\QueryException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\HttpKernel\Exception\MethodNotAllowedHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Throwable;

/**
 * Global Exception Handler for the Jolly Jobs API.
 *
 * Every unhandled exception is caught here and mapped to a standardised
 * JSON envelope produced by ApiResponse, so the frontend always receives
 * a predictable error structure – regardless of the exception type.
 */
class Handler extends ExceptionHandler
{
    /**
     * Exceptions that should NOT be reported to the log.
     *
     * @var array<int, class-string<Throwable>>
     */
    protected $dontReport = [
        AuthenticationException::class,
        AuthorizationException::class,
        ValidationException::class,
        ModelNotFoundException::class,
        NotFoundHttpException::class,
        MethodNotAllowedHttpException::class,
    ];

    /**
     * Fields whose values should be scrubbed from exception reports.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks.
     */
    public function register(): void
    {
        $this->reportable(function (Throwable $e): void {});
    }


    public function render($request, Throwable $e): mixed
    {
        if ($this->isApiRequest($request)) {
            return $this->handleApiException($request, $e);
        }

        return parent::render($request, $e);
    }

   // ========================== Private ===================================
    /**
     * Determine whether the incoming request expects a JSON / API response.
     */
    private function isApiRequest(Request $request): bool
    {
        return $request->expectsJson()
            || $request->is('api/*');
    }

    /**
     * Map a Throwable to the appropriate ApiResponse.
     */
    private function handleApiException(Request $request, Throwable $e): \Illuminate\Http\JsonResponse
    {
        // Validation errors (422) 
        if ($e instanceof ValidationException) {
            return ApiResponse::validationError(
                $e->errors(),
                'Validation failed. Please check the provided data.'
            );
        }

        //  Unauthenticated (401) 
        if ($e instanceof AuthenticationException) {
            return ApiResponse::unauthorized(
                'Unauthenticated. Please log in to continue.'
            );
        }

        //  Authorisation / policy (403)
        if ($e instanceof AuthorizationException) {
            return ApiResponse::forbidden(
                $e->getMessage() ?: 'You do not have permission to perform this action.'
            );
        }

        // Model not found (404) 
        if ($e instanceof ModelNotFoundException) {
            $model   = class_basename($e->getModel());
            $ids     = implode(', ', (array) $e->getIds());
            $message = $ids
                ? "{$model} with id [{$ids}] was not found."
                : "{$model} not found.";

            return ApiResponse::notFound($message);
        }

        // Route / URL not found (404) 
        if ($e instanceof NotFoundHttpException) {
            return ApiResponse::notFound('The requested endpoint does not exist.');
        }

        // HTTP Method not allowed (405) 
        if ($e instanceof MethodNotAllowedHttpException) {
            return ApiResponse::error(
                'HTTP method not allowed for this route.',
                null,
                405
            );
        }

        // Database / query errors (500)
        if ($e instanceof QueryException) {
            report($e); // always log DB errors

            if ($e->getCode() === 23000) {
                return ApiResponse::conflict('Duplicate entry');
            }

            return ApiResponse::serverError(
                'A database error occurred. Please try again later.'
            );
        }

        //  Generic Symfony / Laravel HTTP exceptions 
        if ($e instanceof HttpException) {
            return ApiResponse::error(
                $e->getMessage() ?: 'An HTTP error occurred.',
                null,
                $e->getStatusCode()
            );
        }


        report($e);

        return ApiResponse::serverError(
            'An unexpected error occurred. Please try again later.',
            app()->isProduction() ? null : [
                'exception' => get_class($e),
                'message'   => $e->getMessage(),
                'file'      => $e->getFile(),
                'line'      => $e->getLine(),
                'trace'     => collect($e->getTrace())->take(10)->toArray(),
            ]
        );
    }
}
