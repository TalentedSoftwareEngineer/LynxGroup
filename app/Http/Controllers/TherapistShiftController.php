<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\TherapistShift;

class TherapistShiftController extends Controller
{
    private $g_dayStartDateTime = '';
    private $g_dayEndDateTime = '';

    public function registTherapistShift(Request $request): JsonResponse
    {
        $registed = TherapistShift::create([
            'therapist_id' => $request->therapist_id,
            'therapist_name' => $request->therapist_name,
            'shift_fromTime' => $request->shift_fromTime,
            'shift_toTime' => $request->shift_toTime,
            'shift_status' => $request->shift_status,
            'shift_store' => $request->shift_store,
        ]);
        return response()->json($registed);
    }

    public function getConfirmedShifts(Request $request): JsonResponse
    {
        $results = DB::table('therapist_shift')->get();
        return response()->json($results);
    }

    public function deleteConfirmedShift(Request $request): JsonResponse
    {
        $deleted = DB::table('therapist_shift')
            ->where('id', $request->shift_id)
            ->delete();

        DB::table('reservation')
            ->where('shift_id', $request->shift_id)
            ->delete();
        
        return response()->json($deleted);
    }

    public function editConfirmedShift(Request $request): JsonResponse
    {
        $updated = DB::table('therapist_shift')
            ->where('id', $request->shift_id)
            ->update([
                'therapist_id' => $request->therapist_id,
                'therapist_name' => $request->therapist_name,
                'shift_fromTime' => $request->shift_fromTime,
                'shift_toTime' => $request->shift_toTime,
                'shift_status' => $request->shift_status,
                'shift_store' => $request->shift_store,
            ]);

        DB::table('reservation')
            ->where('shift_id', $request->shift_id)
            ->update([
                'therapist_id' => $request->therapist_id,
                'reserve_store' => $request->shift_store,
            ]);

        return response()->json($updated);
    }

    public function getReserveTableShifts(Request $request): JsonResponse
    {
        $this->g_dayStartDateTime = $request->dayStartDateTime;
        $this->g_dayEndDateTime = $request->dayEndDateTime;

        $results = DB::table('therapist_shift')
            ->where(function ($query) {
                return $query
                    ->where(
                        'therapist_shift.shift_fromTime',
                        '>=',
                        $this->g_dayStartDateTime
                    )
                    ->where(
                        'therapist_shift.shift_toTime',
                        '<=',
                        $this->g_dayEndDateTime
                    );
            })
            ->groupBy(['therapist_name', 'shift_store'])
            ->get([
                'therapist_shift.therapist_name',
                'therapist_shift.shift_store',
            ]);
        return response()->json($results);
    }
}
