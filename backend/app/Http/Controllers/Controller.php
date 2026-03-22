<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;

abstract class Controller
{
    /**
     * Returns a successful JSON response.
     *
     * @param mixed $data The response data.
     * @param string $message The response message. Defaults to 'Request completed successfully.'.
     * @param int $status The response status code. Defaults to 200.
     * @param array $meta The response metadata. Defaults to an empty array.
     * @return JsonResponse
     */
    protected function successResponse(mixed $data, string $message = 'Request completed successfully.', int $status = 200, array $meta = []): JsonResponse
    {
        $payload = [
            'success' => true,
            'message' => $message,
            'data' => $data,
        ];

        if (!empty($meta)) {
            $payload['meta'] = $meta;
        }

        return response()->json($payload, $status);
    }

    /**
     * Returns an error JSON response.
     *
     * @param string $message The error message.
     * @param array $errors The error details. Defaults to an empty array.
     * @param int $status The response status code. Defaults to 400.
     * @return JsonResponse
     */
    protected function errorResponse(string $message, array $errors = [], int $status = 400): JsonResponse
    {
        $payload = [
            'success' => false,
            'message' => $message,
        ];

        if (!empty($errors)) {
            $payload['errors'] = $errors;
        }

        return response()->json($payload, $status);
    }
}
