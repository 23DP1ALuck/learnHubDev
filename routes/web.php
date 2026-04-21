<?php

use App\Http\Controllers\AccountInvitesController;
use App\Http\Controllers\AssignmentsController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\OnboardingRequestController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\MaterialFilesController;
use App\Http\Controllers\MaterialsController;
use App\Http\Controllers\ModulesController;
use App\Http\Controllers\OrganizationOwnerController;
use App\Http\Controllers\OrganizationsPageController;
use App\Http\Controllers\SchoolGroupController;
use App\Http\Controllers\SessionController;
use App\Http\Controllers\StudentContentController;
use App\Http\Controllers\SubmissionController;
use App\Http\Controllers\TaskAnswersController;
use App\Http\Controllers\TasksController;
use App\Http\Controllers\TeacherContentController;
use App\Http\Controllers\TopicController;
use App\Http\Middleware\CheckCanManageLearningContent;
use App\Http\Middleware\CheckIsAdmin;
use App\Http\Middleware\CheckIsOrganizationOwner;
use App\Http\Middleware\CheckIsSchoolOwner;
use App\Http\Middleware\CheckIsStudent;
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
    Route::get('/chats', [ChatController::class, 'chats'])->name('chats');
    Route::post('/chats', [ChatController::class, 'createChat'])->name('chats.store');
    Route::patch('/session/active-organization', [SessionController::class, 'setActiveOrganization'])->name('active-organization');
    Route::get('/download-material/{module}/{topic}/{material}/{file}', [MaterialFilesController::class, 'download'])->name('download-material');
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
    Route::get('organization/{organization_id}/groups/{group_id}/available-modules', [OrganizationOwnerController::class, 'availableModules'])->name('groups.available-modules');
    Route::post('organization/groups', [SchoolGroupController::class, 'store'])->name('groups.store');
    Route::patch('organization/groups/assign-students', [OrganizationOwnerController::class, 'assignStudents'])->name('groups.assign-students');
    Route::patch('organization/groups/assign-modules', [OrganizationOwnerController::class, 'assignModules'])->name('groups.assign-modules');
});
Route::middleware(['auth', 'verified', CheckCanManageLearningContent::class])->group(function () {
    Route::get('/teacher/marks', [TeacherContentController::class, 'marks'])->name('teacher.marks');
    Route::get('/teacher/modules', [TeacherContentController::class, 'modules'])->name('teacher.modules');
    Route::get('/teacher/modules/{module}', [TeacherContentController::class, 'module'])->name('teacher.modules.show');
    Route::get('/teacher/modules/{module}/topics/{topic}', [TeacherContentController::class, 'topic'])->name('teacher.topics.show');
    Route::get('/teacher/modules/{module}/topics/{topic}/materials/{material}', [TeacherContentController::class, 'material'])->name('teacher.materials.show');
    Route::get('/teacher/assignments/{assignment}', [TeacherContentController::class, 'assignment'])->name('teacher.assignments.show');
    Route::get('/preview/{assignment_id}/task/{task_id}', [TeacherContentController::class, 'task'])->name('teacher.tasks.preview');
    Route::get('/teacher/assignments/{assignment}/tasks/{task}/edit', [TeacherContentController::class, 'editTask'])->name('teacher.tasks.editTask');

    Route::post('modules', [ModulesController::class, 'store'])->name('modules.store');
    Route::post('topics', [TopicController::class, 'store'])->name('topics.store');
    Route::post('materials', [MaterialsController::class, 'store'])->name('materials.store');
    Route::post('material-files', [MaterialFilesController::class, 'store'])->name('material-files.store');
    Route::post('assignments', [AssignmentsController::class, 'store'])->name('assignments.store');
    Route::post('tasks', [TasksController::class, 'store'])->name('tasks.store');

    Route::patch('/assignments/{assignment_id}/tasks/{task_id}', [TasksController::class, 'update'])->name('tasks.update');
});
Route::middleware(['auth', 'verified', CheckIsStudent::class])->group(function () {
    Route::get('/student/modules', [StudentContentController::class, 'modules'])->name('student.modules');
    Route::get('/module/{module_id}', [StudentContentController::class, 'module'])->name('student.modules.show');
    Route::get('/module/{module}/topic/{topic}', [StudentContentController::class, 'topic'])->name('student.topics.show');
    Route::get('/module/{module}/topic/{topic}/materials/{material}', [StudentContentController::class, 'material'])->name('student.materials.show');
    Route::get('/student/assignments', [StudentContentController::class, 'assignments'])->name('student.assignments');
    Route::get('/student/assignments/{assignment_id}', [StudentContentController::class, 'assignment'])->name('student.assignments.show');
    Route::get('/student/assignments/{assignment}/tasks/{task}', [StudentContentController::class, 'task'])->name('student.tasks.show');

    Route::post('/student/assignments/{assignment}/start', [SubmissionController::class, 'store'])->name('student.submission.store');
    Route::post('/student/assignments/{assignment}/task/{task}', [TaskAnswersController::class, 'store'])->name('student.answers.store');
    Route::get('/student/marks', [StudentContentController::class, 'marks'])->name('student.marks');
});
Route::get('/join/{token}', [AccountInvitesController::class, 'showJoinForm']);
Route::post('/join/{token}', [AccountInvitesController::class, 'join']);

require __DIR__.'/settings.php';
