<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\AccountAssign;

class AccountAssignController extends Controller
{
    public function registAccountCourse(Request $request): JsonResponse
    {
        $add = AccountAssign::create([
            'accountCourse_name' => $request->account_name,
            'accountCourse_from' => $request->account_from,
            'accountCourse_to' => $request->account_to,
            'accountCourse_memo' => $request->account_memo,
        ]);
        return response()->json($add);
    }

    public function getAccountCourses(): JsonResponse
    {
        $results = DB::table('accountassign')->get();
        return response()->json($results);
    }

    public function deleteAccountCourse(Request $request): JsonResponse
    {
        $deleted = DB::table('accountassign')
            ->where('id', $request->id)
            ->delete();
        return response()->json($deleted);
    }

    public function editAccountCourse(Request $request): JsonResponse
    {
        $updated = DB::table('accountassign')
            ->where('id', $request->account_id)
            ->update([
                'accountCourse_name' => $request->account_name,
                'accountCourse_from' => $request->account_from,
                'accountCourse_to' => $request->account_to,
                'accountCourse_memo' => $request->account_memo,
            ]);

        return response()->json($updated);
    }
}
