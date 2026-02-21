<?php

namespace App\Exceptions;

use Exception;

class InvalidTokenFormatException extends Exception
{
    public function __construct(string $message = 'Invalid token format.')
    {
        parent::__construct($message);
    }
}
