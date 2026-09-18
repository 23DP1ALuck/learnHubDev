<?php

namespace App\Http\Controllers;

use App\Http\Requests\SendContactUsMessageRequest;
use App\Mail\ContactUsMail;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class ContactUsController extends Controller
{
    public function send(SendContactUsMessageRequest $request)
    {
        $validated = $request->validated();

        try {
            Mail::to(config('mail.to.address'))->send(new ContactUsMail(
                firstname: $validated['first_name'],
                lastname: $validated['last_name'],
                email: $validated['email'],
                message: $validated['message'],
            ));
        } catch (\Throwable $e) {
            Log::error('Failed to send contact-us message.', [
                'email' => $validated['email'],
                'exception' => $e,
            ]);

            return redirect()->back()->with('error', 'Failed to send message. Please try again later.');
        }

        return redirect()->back()->with('success', 'Message sent successfully.');
    }
}
