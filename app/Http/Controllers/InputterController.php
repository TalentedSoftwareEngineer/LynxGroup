<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Inputter;

class InputterController extends Controller
{
    public function registInputter(Request $request): JsonResponse
    {
        $registed = Inputter::create([
            'inputter_name' => $request->inputter_name,
            'inputter_memo' => $request->inputter_memo,
        ]);
        return response()->json($registed);
    }

    public function getInputters(): JsonResponse
    {
        $result = DB::table('inputter')->get();
        return response()->json($result);
    }

    public function deleteInputter(Request $request): JsonResponse
    {
        $deleted = DB::table('inputter')
            ->where('id', $request->inputterId)
            ->delete();
        return response()->json($deleted);
    }

    public function editInputter(Request $request): JsonResponse
    {
        $updated = DB::table('inputter')
            ->where('id', $request->inputterId)
            ->update([
                'inputter_name' => $request->inputter_name,
                'inputter_memo' => $request->inputter_memo,
            ]);

        return response()->json($updated);
    }
}
