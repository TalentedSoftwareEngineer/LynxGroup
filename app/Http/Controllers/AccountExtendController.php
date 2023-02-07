<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\AccountExtend;

class AccountExtendController extends Controller
{
    public function registAccountCourse(Request $request): JsonResponse
    {
        $add = AccountExtend::create([
            'accountCourse_name' => $request->account_name,
            'accountCourse_from' => $request->account_from,
            'accountCourse_to' => $request->account_to,
            'extend_during' => $request->extend_during,
            'accountCourse_memo' => $request->account_memo,
        ]);
        return response()->json($add);
    }

    public function getAccountCourses(): JsonResponse
    {
        $results = DB::table('accountextend')->get();
        return response()->json($results);
    }

    public function deleteAccountCourse(Request $request): JsonResponse
    {
        $deleted = DB::table('accountextend')
            ->where('id', $request->id)
            ->delete();
        return response()->json($deleted);
    }

    public function editAccountCourse(Request $request): JsonResponse
    {
        $updated = DB::table('accountextend')
            ->where('id', $request->account_id)
            ->update([
                'accountCourse_name' => $request->account_name,
                'accountCourse_from' => $request->account_from,
                'accountCourse_to' => $request->account_to,
                'extend_during' => $request->extend_during,
                'accountCourse_memo' => $request->account_memo,
            ]);

        return response()->json($updated);
    }
}
