<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Store;

class StoreController extends Controller
{
    public function registStore(Request $request): JsonResponse
    {
        $store = Store::create([
            'store_name' => $request->store_name,
            'store_area' => $request->store_area,
            'store_memo' => $request->store_memo,
        ]);
        return response()->json($store);
    }

    public function getStores(): JsonResponse
    {
        $stores = DB::table('store')->get();
        return response()->json($stores);
    }

    public function deleteStore(Request $request): JsonResponse
    {
        $deletedStore = DB::table('store')
            ->where('id', $request->storeId)
            ->delete();
        return response()->json($deletedStore);
    }

    public function editStore(Request $request): JsonResponse
    {
        $updatedStore = DB::table('store')
            ->where('id', $request->store_id)
            ->update([
                'store_name' => $request->store_name,
                'store_area' => $request->store_area,
                'store_memo' => $request->store_memo,
            ]);

        return response()->json($updatedStore);
    }
}
