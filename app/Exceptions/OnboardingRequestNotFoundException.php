<?php

namespace App\Exceptions;

use Exception;

class OnboardingRequestNotFoundException extends Exception
{
    public function __construct(string $message = 'Onboarding request not found.')
    {
        parent::__construct($message);
    }
}
