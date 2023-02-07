<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Customer;

class CustomerController extends Controller
{
    public function registCustomer(Request $request): JsonResponse
    {
        $customer = Customer::create([
            'customer_name' => $request->customer_name,
            'customer_tel' => $request->customer_tel,
            'customer_memo' => $request->customer_memo,
        ]);
        return response()->json($customer);
    }

    public function getCustomers(): JsonResponse
    {
        $customers = DB::table('customer')->get();
        return response()->json($customers);
    }

    public function deleteCustomer(Request $request): JsonResponse
    {
        $deletedCustomer = DB::table('customer')
            ->where('id', $request->customerId)
            ->delete();
        return response()->json($deletedCustomer);
    }

    public function editCustomer(Request $request): JsonResponse
    {
        $updatedCustomer = DB::table('customer')
            ->where('id', $request->customer_id)
            ->update([
                'customer_name' => $request->customer_name,
                'customer_tel' => $request->customer_tel,
                'customer_memo' => $request->customer_memo,
            ]);

        return response()->json($updatedCustomer);
    }
}
