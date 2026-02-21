<?php

namespace App\Exceptions;

use Exception;

class InviteNotFoundException extends Exception
{
    public function __construct(string $message = 'Invite not found.')
    {
        parent::__construct($message);
    }
}
