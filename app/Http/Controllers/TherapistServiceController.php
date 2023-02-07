<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\TherapistService;

class TherapistServiceController extends Controller
{
    public function registTherapistService(Request $request): JsonResponse
    {
        $created = TherapistService::create([
            'therapist_serv_name' => $request->therapist_serv_name,
            'therapist_serv_memo' => $request->therapist_serv_memo,
        ]);
        return response()->json($created);
    }

    public function getTherapistServices(): JsonResponse
    {
        $results = DB::table('therapist_service')->get();
        return response()->json($results);
    }

    public function deleteTherapistService(Request $request): JsonResponse
    {
        $deleted = DB::table('therapist_service')
            ->where('id', $request->therapistServiceId)
            ->delete();
        return response()->json($deleted);
    }

    public function editTherapistService(Request $request): JsonResponse
    {
        $updated = DB::table('therapist_service')
            ->where('id', $request->therapistService_id)
            ->update([
                'therapist_serv_name' => $request->therapist_serv_name,
                'therapist_serv_memo' => $request->therapist_serv_memo,
            ]);

        return response()->json($updated);
    }
}
