<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\AccountMenu;

class AccountMenuController extends Controller
{
    public function registAccountMenu(Request $request): JsonResponse
    {
        $add = AccountMenu::create([
            'accountMenu_name' => $request->accountMenu_name,
            'accountMenu_memo' => $request->accountMenu_memo,
        ]);
        return response()->json($add);
    }

    public function getAccountMenus(): JsonResponse
    {
        $results = DB::table('accountmenu')->get();
        return response()->json($results);
    }

    public function deleteAccountMenu(Request $request): JsonResponse
    {
        $deleted = DB::table('accountmenu')
            ->where('id', $request->id)
            ->delete();
        return response()->json($deleted);
    }

    public function editAccountMenu(Request $request): JsonResponse
    {
        $updated = DB::table('accountmenu')
            ->where('id', $request->accountMenu_id)
            ->update([
                'accountMenu_name' => $request->accountMenu_name,
                'accountMenu_memo' => $request->accountMenu_memo,
            ]);

        return response()->json($updated);
    }
}
