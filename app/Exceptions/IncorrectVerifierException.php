<?php

namespace App\Exceptions;

use Exception;

class IncorrectVerifierException extends Exception
{
    public function __construct(string $message = 'Verifier is incorrect.')
    {
        parent::__construct($message);
    }
}
