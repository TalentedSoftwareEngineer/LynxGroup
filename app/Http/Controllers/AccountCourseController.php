<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\AccountCourse;

class AccountCourseController extends Controller
{
    public function registAccountCourse(Request $request): JsonResponse
    {
        $add = AccountCourse::create([
            'accountCourse_name' => $request->account_name,
            'accountCourse_from' => $request->account_from,
            'accountCourse_to' => $request->account_to,
            'accountCourse_during' => $request->account_during,
            'accountCourse_memo' => $request->account_memo,
        ]);
        return response()->json($add);
    }

    public function getAccountCourses(): JsonResponse
    {
        $results = DB::table('accountcourse')->get();
        return response()->json($results);
    }

    public function deleteAccountCourse(Request $request): JsonResponse
    {
        $deleted = DB::table('accountcourse')
            ->where('id', $request->id)
            ->delete();
        return response()->json($deleted);
    }

    public function editAccountCourse(Request $request): JsonResponse
    {
        $updated = DB::table('accountcourse')
            ->where('id', $request->account_id)
            ->update([
                'id' => $request->account_updateId,
                'accountCourse_name' => $request->account_name,
                'accountCourse_from' => $request->account_from,
                'accountCourse_to' => $request->account_to,
                'accountCourse_during' => $request->account_during,
                'accountCourse_memo' => $request->account_memo,
            ]);

        return response()->json($updated);
    }
}
