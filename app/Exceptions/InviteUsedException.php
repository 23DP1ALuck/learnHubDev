<?php

namespace App\Exceptions;

use Exception;

class InviteUsedException extends Exception
{
    public function __construct(string $message = 'Invite has already been used.')
    {
        parent::__construct($message);
    }
}
