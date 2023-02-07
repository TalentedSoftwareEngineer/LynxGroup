<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\TherapistTally;

class TherapistTallyController extends Controller
{

    public function getTherapistTallyInput(): JsonResponse
    {
        $results = DB::table('therapist_tally')->get();
        return response()->json($results);
    }

    public function handleTallyUnpaid(Request $request): JsonResponse
    {
        $result = DB::table('therapist_tally')
            ->where('tally_therapist', $request->tally_therapist)
            ->where('tally_date', $request->tally_date)
            ->get();

        if( sizeof($result) == 0 ) {
            $created = TherapistTally::create([
                'tally_therapist' => $request->tally_therapist,
                'tally_date' => $request->tally_date,
                'tally_unpaid' => $request->tally_unpaid,
            ]);

            return response()->json($created);
        } else {
            $updated = DB::table('therapist_tally')
            ->where('tally_therapist', $request->tally_therapist)
            ->where('tally_date', $request->tally_date)
            ->update([
                'tally_unpaid' => $request->tally_unpaid,
            ]);

            return response()->json($updated);
        }
    }

    public function handleTallyCheck(Request $request): JsonResponse
    {
        $result = DB::table('therapist_tally')
            ->where('tally_therapist', $request->tally_therapist)
            ->where('tally_date', $request->tally_date)
            ->get();

        if( sizeof($result) == 0 ) {
            $created = TherapistTally::create([
                'tally_therapist' => $request->tally_therapist,
                'tally_date' => $request->tally_date,
                'tally_check' => $request->tally_check,
            ]);

            return response()->json($created);
        } else {
            $updated = DB::table('therapist_tally')
            ->where('tally_therapist', $request->tally_therapist)
            ->where('tally_date', $request->tally_date)
            ->update([
                'tally_check' => $request->tally_check,
            ]);

            return response()->json($updated);
        }
    }

    public function handleTallyRemarks(Request $request): JsonResponse
    {
        $result = DB::table('therapist_tally')
            ->where('tally_therapist', $request->tally_therapist)
            ->where('tally_date', $request->tally_date)
            ->get();

        if( sizeof($result) == 0 ) {
            $created = TherapistTally::create([
                'tally_therapist' => $request->tally_therapist,
                'tally_date' => $request->tally_date,
                'tally_remarks' => $request->tally_remarks,
            ]);

            return response()->json($created);
        } else {
            $updated = DB::table('therapist_tally')
            ->where('tally_therapist', $request->tally_therapist)
            ->where('tally_date', $request->tally_date)
            ->update([
                'tally_remarks' => $request->tally_remarks,
            ]);

            return response()->json($updated);
        }
    }

}
