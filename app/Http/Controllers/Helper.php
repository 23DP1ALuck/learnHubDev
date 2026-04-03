<?php

namespace App\Http\Controllers;
use Illuminate\Database\QueryException;

class Helper{
    public static function isUniqueConstraintViolation(QueryException $e): bool
    {
        $sqlState = $e->errorInfo[0] ?? null;
        $driverErrorCode = $e->errorInfo[1] ?? null;

        return $sqlState === '23505' || $driverErrorCode === 19 || $driverErrorCode === 1062;
    }
}
