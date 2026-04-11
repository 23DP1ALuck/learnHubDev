<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Laravel\Fortify\Contracts\LoginResponse;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->instance(LoginResponse::class, new class implements LoginResponse{
            public function toResponse($request)
            {
                $user = $request->user();
                if( $user->role === 'admin'){
                    return redirect()->route('dashboard');
                }
                $organization = $user->currentOrganization();

                session()->put('activeOrganization', $organization->id);

                return redirect()->route('dashboard')
                    ->with('afterLogin', true);
            }
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
