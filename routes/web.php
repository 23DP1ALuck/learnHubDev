<?php

use App\Http\Controllers\AccountInvitesController;
use App\Http\Controllers\OnboardingRequestController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\OrganizationOwnerController;
use App\Http\Controllers\OrganizationsPageController;
use App\Http\Controllers\SessionController;
use App\Http\Middleware\CheckIsAdmin;
use App\Http\Middleware\CheckIsOrganizationOwner;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::post('onboarding-requests', [OnboardingRequestController::class, 'store'])->name('onboarding-requests.store');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::patch('/session/active-organization', [SessionController::class, 'setActiveOrganization'])->name('active-organization');
});
Route::middleware(['auth', 'verified', CheckIsAdmin::class])->group(function () {
    Route::get('onboarding-requests', [OnboardingRequestController::class, 'index'])->name('onboarding-requests');
    Route::get('organizations', [OrganizationsPageController::class, 'index'])->name('organizations');
    Route::post('/account-invites', [AccountInvitesController::class, 'store'])->name('account-invites.store');
});

Route::middleware(['auth', 'verified', CheckIsOrganizationOwner::class])
    ->group(function () {
        Route::get('organization', [OrganizationOwnerController::class, 'organization'])->name('organization');
        Route::get('organization/users', [OrganizationOwnerController::class, 'users'])->name('users');
        Route::get('organization/invitations', [OrganizationOwnerController::class, 'invitations'])->name('invitations');
        Route::post('organization/invitations', [AccountInvitesController::class, 'storeOrganizationInvite'])->name('invitations.store');
    });

Route::get('/join/{token}', [AccountInvitesController::class, 'showJoinForm']);
Route::post('/join/{token}', [AccountInvitesController::class, 'join']);

require __DIR__.'/settings.php';
