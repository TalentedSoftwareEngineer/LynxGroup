<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Reservation;

class ReservationController extends Controller
{
    private $g_dayStartDateTime = '';
    private $g_dayEndDateTime = '';

    public function registReservation(Request $request): JsonResponse
    {
        $registed = Reservation::create([
            'shift_id' => $request->shift_id,
            'therapist_id' => $request->therapist,
            'reserve_store' => $request->reserve_store,
            'nomination_id' => $request->nomination,
            'discount' => $request->discount,
            'menu_id' => $request->menu,
            'menu_payment_id' => $request->menu_payment,
            'extend_id' => $request->extend,
            'extend_payment_id' => $request->extend_payment,
            'option_id' => $request->input_option,
            'option_payment_id' => $request->option_payment,
            'card_fee' => $request->card_fee,
            'reservation_from' => $request->startReservationTime,
            'reservation_to' => $request->endReservationTime,
            'fee' => $request->fee,
            'customer_name' => $request->customer_name,
            'customer_tel' => $request->customer_tel,
            'new_repeater' => $request->new_repeater,
            'customer_req' => $request->customer_req,
            'treatment_memo' => $request->treatment,
            'contact_memo' => $request->contact_memo,
        ]);
        return response()->json($registed);
    }

    public function getReservations(): JsonResponse
    {
        $result = DB::table('reservation')->get();
        return response()->json($result);
    }

    public function deleteReservation(Request $request): JsonResponse
    {
        $deleted = DB::table('reservation')
            ->where('id', $request->reservationId)
            ->delete();
        return response()->json($deleted);
    }

    public function editReservation(Request $request): JsonResponse
    {
        $updated = DB::table('reservation')
            ->where('id', $request->reservationId)
            ->update([
                'therapist_id' => $request->therapist,
                'reserve_store' => $request->reserve_store,
                'nomination_id' => $request->nomination,
                'discount' => $request->discount,
                'menu_id' => $request->menu,
                'menu_payment_id' => $request->menu_payment,
                'extend_id' => $request->extend,
                'extend_payment_id' => $request->extend_payment,
                'option_id' => $request->input_option,
                'option_payment_id' => $request->option_payment,
                'card_fee' => $request->card_fee,
                'reservation_from' => $request->startReservationTime,
                'reservation_to' => $request->endReservationTime,
                'fee' => $request->fee,
                'customer_name' => $request->customer_name,
                'customer_tel' => $request->customer_tel,
                'new_repeater' => $request->new_repeater,
                'customer_req' => $request->customer_req,
                'treatment_memo' => $request->treatment,
                'contact_memo' => $request->contact_memo
            ]);

        return response()->json($updated);
    }

    public function getReservationsWithNomination(Request $request): JsonResponse 
    {
        $result = DB::table('reservation')
            ->leftjoin('accountassign', function ($join) {
                $join->on('accountassign.id', '=', 'reservation.nomination_id');
            })
            ->get([
                'reservation.*',
                'accountassign.accountCourse_name',
                'accountassign.accountCourse_from',
                'accountassign.accountCourse_to',
                'accountassign.accountCourse_memo',
            ]);
        return response()->json($result);
    }

    public function getDailyReportData(Request $request): JsonResponse
    {
        $this->g_dayStartDateTime = $request->dayStartDateTime;
        $this->g_dayEndDateTime = $request->dayEndDateTime;

        $result = DB::table('reservation')
            ->leftjoin('therapist', function ($join) {
                $join->on('therapist.id', '=', 'reservation.therapist_id');
            })
            ->leftjoin('referrer', function ($join) {
                $join->on('referrer.id', '=', 'therapist.referrer');
            })
            ->leftjoin('accountassign', function ($join) {
                $join->on('accountassign.id', '=', 'reservation.nomination_id');
            })
            ->leftjoin('accountcourse', function ($join) {
                $join->on('accountcourse.id', '=', 'reservation.menu_id');
            })
            ->leftjoin('accountextend', function ($join) {
                $join->on('accountextend.id', '=', 'reservation.extend_id');
            })
            ->leftjoin('accountoption', function ($join) {
                $join->on('accountoption.id', '=', 'reservation.option_id');
            })
            ->leftjoin('accountpayment as menu_payment', function ($join) {
                $join->on('menu_payment.id', '=', 'reservation.menu_payment_id');
            })
            ->leftjoin('accountpayment as extend_payment', function ($join) {
                $join->on('extend_payment.id', '=', 'reservation.extend_payment_id');
            })
            ->leftjoin('accountpayment as option_payment', function ($join) {
                $join->on('option_payment.id', '=', 'reservation.option_payment_id');
            })
            ->where(function ($query) {
                return $query
                    ->where(
                        'reservation.reservation_from',
                        '>=',
                        $this->g_dayStartDateTime
                    )
                    ->where(
                        'reservation.reservation_to',
                        '<=',
                        $this->g_dayEndDateTime
                    );
            })
            ->orderBy('reservation.reserve_store')
            ->get([
                'reservation.*',
                'therapist.therapist_name',
                'therapist.nomination_fee',
                'therapist.main_nomination_fee',
                'therapist.referrer',
                'referrer.referrer_name',
                'referrer.referrer_fee',
                'accountassign.accountCourse_name as nomination_name',
                'accountassign.accountCourse_from as nomination_fromFee',
                'accountassign.accountCourse_to as nomination_toFee',
                'accountcourse.accountCourse_name as menu_name',
                'accountcourse.accountCourse_from as menu_fromFee',
                'accountcourse.accountCourse_to as menu_toFee',
                'accountextend.accountCourse_name as extend_name',
                'accountextend.accountCourse_from as extend_FromFee',
                'accountextend.accountCourse_to as extend_toFee',
                'accountoption.accountCourse_name as option_name',
                'accountoption.accountCourse_from as option_fromFee',
                'accountoption.accountCourse_to as option_toFee',
                'menu_payment.accountCourse_name as menu_payment_name',
                'extend_payment.accountCourse_name as extend_payment_name',
                'option_payment.accountCourse_name as option_payment_name'
            ]);

        return response()->json($result);
    }

    public function getTherapistTallyData(Request $request): JsonResponse
    {
        $this->g_dayStartDateTime = $request->dayStartDateTime;
        $this->g_dayEndDateTime = $request->dayEndDateTime;

        $result = DB::table('reservation')
            ->leftjoin('therapist', function ($join) {
                $join->on('therapist.id', '=', 'reservation.therapist_id');
            })
            ->where(function ($query) {
                return $query
                    ->where(
                        'reservation.reservation_from',
                        '>=',
                        $this->g_dayStartDateTime
                    )
                    ->where(
                        'reservation.reservation_to',
                        '<=',
                        $this->g_dayEndDateTime
                    );
            })
            ->groupBy([
                'therapist.therapist_name'
            ])
            ->get([
                'therapist.therapist_name'
            ]);

        return response()->json($result);
    }

    public function getReservationFullData(): JsonResponse
    {

        $result = DB::table('reservation')
            ->leftjoin('therapist', function ($join) {
                $join->on('therapist.id', '=', 'reservation.therapist_id');
            })
            ->leftjoin('referrer', function ($join) {
                $join->on('referrer.id', '=', 'therapist.referrer');
            })
            ->leftjoin('accountassign', function ($join) {
                $join->on('accountassign.id', '=', 'reservation.nomination_id');
            })
            ->leftjoin('accountcourse', function ($join) {
                $join->on('accountcourse.id', '=', 'reservation.menu_id');
            })
            ->leftjoin('accountextend', function ($join) {
                $join->on('accountextend.id', '=', 'reservation.extend_id');
            })
            ->leftjoin('accountoption', function ($join) {
                $join->on('accountoption.id', '=', 'reservation.option_id');
            })
            ->leftjoin('accountpayment as menu_payment', function ($join) {
                $join->on('menu_payment.id', '=', 'reservation.menu_payment_id');
            })
            ->leftjoin('accountpayment as extend_payment', function ($join) {
                $join->on('extend_payment.id', '=', 'reservation.extend_payment_id');
            })
            ->leftjoin('accountpayment as option_payment', function ($join) {
                $join->on('option_payment.id', '=', 'reservation.option_payment_id');
            })
            ->select(
                'reservation.*',
                'therapist.therapist_name',
                'therapist.nomination_fee',
                'therapist.main_nomination_fee',
                'therapist.referrer',
                'referrer.referrer_name',
                'referrer.referrer_fee',
                'accountassign.accountCourse_name as nomination_name',
                'accountassign.accountCourse_from as nomination_fromFee',
                'accountassign.accountCourse_to as nomination_toFee',
                'accountcourse.accountCourse_name as menu_name',
                'accountcourse.accountCourse_from as menu_fromFee',
                'accountcourse.accountCourse_to as menu_toFee',
                'accountextend.accountCourse_name as extend_name',
                'accountextend.accountCourse_from as extend_FromFee',
                'accountextend.accountCourse_to as extend_toFee',
                'accountoption.accountCourse_name as option_name',
                'accountoption.accountCourse_from as option_fromFee',
                'accountoption.accountCourse_to as option_toFee',
                'menu_payment.accountCourse_name as menu_payment_name',
                'extend_payment.accountCourse_name as extend_payment_name',
                'option_payment.accountCourse_name as option_payment_name'
            )->get();

        return response()->json($result);
    }
}
