<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\StoreController;
use App\Http\Controllers\TherapistController;
use App\Http\Controllers\AccountMenuController;
use App\Http\Controllers\AccountCourseController;
use App\Http\Controllers\AccountAssignController;
use App\Http\Controllers\AccountOptionController;
use App\Http\Controllers\AccountPaymentController;
use App\Http\Controllers\AccountExtendController;
use App\Http\Controllers\CustomerMgrController;
use App\Http\Controllers\ReferrerController;
use App\Http\Controllers\TherapistServiceController;
use App\Http\Controllers\TherapistShiftController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\InputterController;
use App\Http\Controllers\GenreController;
use App\Http\Controllers\ScheduleController;
use App\Http\Controllers\TherapistTallyController;

Route::group(['middleware' => ['web']], function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::post('login', [LoginController::class, 'authenticate']);
    Route::post('signup', [LoginController::class, 'signup']);
    Route::post('deleteuser', [LoginController::class, 'deleteUser']);
    Route::post('edituser', [LoginController::class, 'editUser']);
    Route::get('getusers', [LoginController::class, 'getUsers']);

    Route::post('/logout', [LoginController::class, 'logout']);

    //
    Route::post('/registcustomer', [
        CustomerController::class,
        'registCustomer',
    ]);
    Route::get('/getcustomers', [CustomerController::class, 'getCustomers']);
    Route::post('/deletecustomer', [
        CustomerController::class,
        'deleteCustomer',
    ]);
    Route::post('/editcustomer', [CustomerController::class, 'editCustomer']);

    //
    Route::get('/getstores', [StoreController::class, 'getStores']);
    Route::post('/registstore', [StoreController::class, 'registStore']);
    Route::post('/deletestore', [StoreController::class, 'deleteStore']);
    Route::post('/editstore', [StoreController::class, 'editStore']);

    //Therapist
    Route::get('/gettherapists', [TherapistController::class, 'getTherapists']);
    Route::post('/registtherapist', [
        TherapistController::class,
        'registTherapist',
    ]);
    Route::post('/deletetherapist', [
        TherapistController::class,
        'deleteTherapist',
    ]);
    Route::post('/edittherapist', [
        TherapistController::class,
        'editTherapist',
    ]);

    //
    Route::get('/getAccountMenus', [
        AccountMenuController::class,
        'getAccountMenus',
    ]);
    Route::post('/registAccountMenu', [
        AccountMenuController::class,
        'registAccountMenu',
    ]);
    Route::post('/deleteAccountMenu', [
        AccountMenuController::class,
        'deleteAccountMenu',
    ]);
    Route::post('/editAccountMenu', [
        AccountMenuController::class,
        'editAccountMenu',
    ]);

    //AccountCourse
    Route::get('/getAccountCourses', [
        AccountCourseController::class,
        'getAccountCourses',
    ]);
    Route::post('/registAccountCourse', [
        AccountCourseController::class,
        'registAccountCourse',
    ]);
    Route::post('/deleteAccountCourse', [
        AccountCourseController::class,
        'deleteAccountCourse',
    ]);
    Route::post('/editAccountCourse', [
        AccountCourseController::class,
        'editAccountCourse',
    ]);

    //AccountAssign
    Route::get('/getAccountAssgin', [
        AccountAssignController::class,
        'getAccountCourses',
    ]);
    Route::post('/registAccountAssgin', [
        AccountAssignController::class,
        'registAccountCourse',
    ]);
    Route::post('/deleteAccountAssgin', [
        AccountAssignController::class,
        'deleteAccountCourse',
    ]);
    Route::post('/editAccountAssgin', [
        AccountAssignController::class,
        'editAccountCourse',
    ]);

    //AccountOption
    Route::get('/getAccountOption', [
        AccountOptionController::class,
        'getAccountCourses',
    ]);
    Route::post('/registAccountOption', [
        AccountOptionController::class,
        'registAccountCourse',
    ]);
    Route::post('/deleteAccountOption', [
        AccountOptionController::class,
        'deleteAccountCourse',
    ]);
    Route::post('/editAccountOption', [
        AccountOptionController::class,
        'editAccountCourse',
    ]);

    //AccountPayment
    Route::get('/getAccountPayment', [
        AccountPaymentController::class,
        'getAccountCourses',
    ]);
    Route::post('/registAccountPayment', [
        AccountPaymentController::class,
        'registAccountCourse',
    ]);
    Route::post('/deleteAccountPayment', [
        AccountPaymentController::class,
        'deleteAccountCourse',
    ]);
    Route::post('/editAccountPayment', [
        AccountPaymentController::class,
        'editAccountCourse',
    ]);

    //AccountExtend
    Route::get('/getAccountExtend', [
        AccountExtendController::class,
        'getAccountCourses',
    ]);
    Route::post('/registAccountExtend', [
        AccountExtendController::class,
        'registAccountCourse',
    ]);
    Route::post('/deleteAccountExtend', [
        AccountExtendController::class,
        'deleteAccountCourse',
    ]);
    Route::post('/editAccountExtend', [
        AccountExtendController::class,
        'editAccountCourse',
    ]);

    //Referrer
    Route::get('/getReferrers', [ReferrerController::class, 'getReferrers']);
    Route::post('/registReferrer', [
        ReferrerController::class,
        'registReferrer',
    ]);
    Route::post('/deleteReferrer', [
        ReferrerController::class,
        'deleteReferrer',
    ]);
    Route::post('/editReferrer', [ReferrerController::class, 'editReferrer']);

    //TherapistService
    Route::get('/getTherapistServices', [
        TherapistServiceController::class,
        'getTherapistServices',
    ]);
    Route::post('/registTherapistService', [
        TherapistServiceController::class,
        'registTherapistService',
    ]);
    Route::post('/deleteTherapistService', [
        TherapistServiceController::class,
        'deleteTherapistService',
    ]);
    Route::post('/editTherapistService', [
        TherapistServiceController::class,
        'editTherapistService',
    ]);

    //TherapistManagement
    Route::post('/editTherapistManagement', [
        TherapistController::class,
        'editTherapistManagement',
    ]);

    //TherapistShift
    Route::get('/getshifttherapists', [
        TherapistController::class,
        'getShiftTherapists',
    ]);
    Route::post('registTherapistShift', [
        TherapistShiftController::class,
        'registTherapistShift',
    ]);
    Route::get('getConfirmedShifts', [
        TherapistShiftController::class,
        'getConfirmedShifts',
    ]);
    Route::post('deleteConfirmedShift', [
        TherapistShiftController::class,
        'deleteConfirmedShift',
    ]);
    Route::post('editConfirmedShift', [
        TherapistShiftController::class,
        'editConfirmedShift',
    ]);
    Route::post('getReserveTableShifts', [
        TherapistShiftController::class,
        'getReserveTableShifts',
    ]);

    //Reservation
    Route::post('registReservation', [
        ReservationController::class,
        'registReservation',
    ]);
    Route::get('getReservations', [
        ReservationController::class,
        'getReservations',
    ]);
    Route::post('deleteReservation', [
        ReservationController::class,
        'deleteReservation',
    ]);
    Route::post('editReservation', [
        ReservationController::class,
        'editReservation',
    ]);
    Route::get('getReservationsWithNomination', [
        ReservationController::class,
        'getReservationsWithNomination',
    ]);
    Route::post('getDailyReportData', [
        ReservationController::class,
        'getDailyReportData',
    ]);
    Route::post('getTherapistTallyData', [ReservationController::class, 'getTherapistTallyData']);
    Route::get('getReservationFullData', [ReservationController::class, 'getReservationFullData']);

    //Inputter
    Route::get('/getInputters', [InputterController::class, 'getInputters']);
    Route::post('/registInputter', [
        InputterController::class,
        'registInputter',
    ]);
    Route::post('/deleteInputter', [
        InputterController::class,
        'deleteInputter',
    ]);
    Route::post('/editInputter', [InputterController::class, 'editInputter']);

    //Genre
    Route::get('/getGenres', [GenreController::class, 'getGenres']);
    Route::post('/registGenre', [GenreController::class, 'registGenre']);
    Route::post('/deleteGenre', [GenreController::class, 'deleteGenre']);
    Route::post('/editGenre', [GenreController::class, 'editGenre']);

    //Schedule
    Route::get('/getSchedules', [ScheduleController::class, 'getSchedules']);
    Route::post('/registSchedule', [
        ScheduleController::class,
        'registSchedule',
    ]);
    Route::post('/deleteSchedule', [
        ScheduleController::class,
        'deleteSchedule',
    ]);
    Route::post('/editSchedule', [ScheduleController::class, 'editSchedule']);

    //TherapistTally
    Route::post('handleTallyUnpaid', [ TherapistTallyController::class, 'handleTallyUnpaid' ]);
    Route::post('handleTallyCheck', [TherapistTallyController::class, 'handleTallyCheck']);
    Route::post('handleTallyRemarks', [TherapistTallyController::class, 'handleTallyRemarks']);
    Route::get('getTherapistTallyInput', [TherapistTallyController::class, 'getTherapistTallyInput']);

    //CustomerMgrController
    Route::post('handleCustomerMgrData', [CustomerMgrController::class, 'handleCustomerMgrData']);
    Route::get('getCustomerMgrData', [CustomerMgrController::class, 'getCustomerMgrData']);
});
