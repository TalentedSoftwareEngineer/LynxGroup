<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Therapist;

class TherapistController extends Controller
{
    public function registTherapist(Request $request): JsonResponse
    {
        $therapist = Therapist::create([
            'therapist_name' => $request->therapist_name,
            'nomination_fee' => $request->nomination_fee,
            'main_nomination_fee' => $request->main_nomination_fee,
            'referrer' => $request->referrer,
            'therapist_email' => $request->therapist_email,
            'can_service' => $request->can_service,
            'therapist_memo' => $request->therapist_memo,
            'shift_isHiden' => 2,
        ]);
        return response()->json($therapist);
    }

    public function getTherapists(): JsonResponse
    {
        $therapists = DB::table('therapist')->get();
        return response()->json($therapists);
    }

    public function deleteTherapist(Request $request): JsonResponse
    {
        $deletedTherapist = DB::table('therapist')
            ->where('id', $request->therapistId)
            ->delete();
        return response()->json($deletedTherapist);
    }

    public function editTherapist(Request $request): JsonResponse
    {
        $updatedTherapist = DB::table('therapist')
            ->where('id', $request->therapist_id)
            ->update([
                'therapist_name' => $request->therapist_name,
                'nomination_fee' => $request->nomination_fee,
                'main_nomination_fee' => $request->main_nomination_fee,
                'referrer' => $request->referrer,
                'therapist_email' => $request->therapist_email,
                'can_service' => $request->can_service,
                'therapist_memo' => $request->therapist_memo,
            ]);

        return response()->json($updatedTherapist);
    }

    public function editTherapistManagement(Request $request): JsonResponse
    {
        $updated = DB::table('therapist')
            ->where('id', $request->therapist_id)
            ->update([
                'shift_isHiden' => $request->shift_isHiden,
                'shift_display_rank' => $request->shift_display_rank,
            ]);

        return response()->json($updated);
    }

    public function getShiftTherapists(): JsonResponse
    {
        $therapists = DB::table('therapist')
            ->where('therapist.shift_isHiden', 2)
            ->orderBy('therapist.shift_display_rank')
            ->get();
        return response()->json($therapists);
    }
}
