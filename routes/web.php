<?php

use App\Http\Controllers\AccountInvitesController;
use App\Http\Controllers\AssignmentsController;
use App\Http\Controllers\OnboardingRequestController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\MaterialsController;
use App\Http\Controllers\ModulesController;
use App\Http\Controllers\OrganizationOwnerController;
use App\Http\Controllers\OrganizationsPageController;
use App\Http\Controllers\SchoolGroupController;
use App\Http\Controllers\SessionController;
use App\Http\Controllers\TasksController;
use App\Http\Controllers\TeacherContentController;
use App\Http\Controllers\TopicController;
use App\Http\Middleware\CheckCanManageLearningContent;
use App\Http\Middleware\CheckIsAdmin;
use App\Http\Middleware\CheckIsOrganizationOwner;
use App\Http\Middleware\CheckIsSchoolOwner;
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
//    Route::post('modules', [ModulesController::class, 'store'])->name('modules.store');
//    Route::post('topics', [TopicController::class, 'store'])->name('topics.store');
//    Route::post('materials', [MaterialsController::class, 'store'])->name('materials.store');
//    Route::post('assignments', [AssignmentsController::class, 'store'])->name('assignments.store');
//    Route::post('tasks', [TasksController::class, 'store'])->name('tasks.store');
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
Route::middleware([CheckIsSchoolOwner::class])->group(function () {
    Route::get('organization/groups', [OrganizationOwnerController::class, 'groups'])->name('groups');
    Route::post('organization/groups', [SchoolGroupController::class, 'store'])->name('groups.store');
    Route::patch('organization/groups/assign-students', [OrganizationOwnerController::class, 'assignStudents'])->name('groups.assign-students');
});
Route::middleware(['auth', 'verified', CheckCanManageLearningContent::class])->group(function () {
    Route::get('/modules', [TeacherContentController::class, 'modules'])->name('teacher.modules');
    Route::get('/modules/{module}', [TeacherContentController::class, 'module'])->name('teacher.modules.show');
    Route::get('/modules/{module}/topics/{topic}', [TeacherContentController::class, 'topic'])->name('teacher.topics.show');
    Route::get('/assignments/{assignment}', [TeacherContentController::class, 'assignment'])->name('teacher.assignments.show');

    Route::post('modules', [ModulesController::class, 'store'])->name('modules.store');
    Route::post('topics', [TopicController::class, 'store'])->name('topics.store');
    Route::post('materials', [MaterialsController::class, 'store'])->name('materials.store');
    Route::post('assignments', [AssignmentsController::class, 'store'])->name('assignments.store');
    Route::post('tasks', [TasksController::class, 'store'])->name('tasks.store');
});
Route::get('/join/{token}', [AccountInvitesController::class, 'showJoinForm']);
Route::post('/join/{token}', [AccountInvitesController::class, 'join']);

require __DIR__.'/settings.php';
