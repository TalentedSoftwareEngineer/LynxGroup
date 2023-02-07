<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Referrer;

class ReferrerController extends Controller
{
    public function registReferrer(Request $request): JsonResponse
    {
        $referrer = Referrer::create([
            'referrer_name' => $request->referrer_name,
            'referrer_fee' => $request->referrer_fee,
            'referrer_memo' => $request->referrer_memo,
        ]);
        return response()->json($referrer);
    }

    public function getReferrers(): JsonResponse
    {
        $referrers = DB::table('referrer')->get();
        return response()->json($referrers);
    }

    public function deleteReferrer(Request $request): JsonResponse
    {
        $deleted = DB::table('referrer')
            ->where('id', $request->referrerId)
            ->delete();
        return response()->json($deleted);
    }

    public function editReferrer(Request $request): JsonResponse
    {
        $updated = DB::table('referrer')
            ->where('id', $request->referrer_id)
            ->update([
                'referrer_name' => $request->referrer_name,
                'referrer_fee' => $request->referrer_fee,
                'referrer_memo' => $request->referrer_memo,
            ]);

        return response()->json($updated);
    }
}
