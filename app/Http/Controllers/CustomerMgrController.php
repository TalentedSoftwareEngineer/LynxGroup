<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\CustomerMgr;

class CustomerMgrController extends Controller
{

    public function getCustomerMgrData(): JsonResponse
    {
        $results = DB::table('customer_mgr')->get();
        return response()->json($results);
    }

    public function handleCustomerMgrData(Request $request): JsonResponse
    {
        $result = DB::table('customer_mgr')
            ->where('reserve_id', $request->reserve_id)
            ->where('usage_date', $request->usage_date)
            ->where('customer_name', $request->customer_name)
            ->where('therapist_name', $request->therapist_name)
            ->get();

        if( sizeof($result) == 0 ) {
            $created = CustomerMgr::create([
                'reserve_id' => $request->reserve_id,
                'usage_date' => $request->usage_date,
                'customer_name' => $request->customer_name,
                'therapist_name' => $request->therapist_name,
                'ok_ng' => $request->ok_ng,
                'memo' => $request->memo,
            ]);

            return response()->json($created);
        } else {
            $updated = DB::table('customer_mgr')
                ->where('reserve_id', $request->reserve_id)
                ->where('usage_date', $request->usage_date)
                ->where('customer_name', $request->customer_name)
                ->where('therapist_name', $request->therapist_name)
                ->update([
                    'ok_ng' => $request->ok_ng,
                ]);

            return response()->json($updated);
        }
    }


}
