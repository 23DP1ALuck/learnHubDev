<?php

namespace App\Exceptions;

use Exception;

class InviteExpiredException extends Exception
{
    public function __construct(string $message = 'Invite has expired.')
    {
        parent::__construct($message);
    }
}
