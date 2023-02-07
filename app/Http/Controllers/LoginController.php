<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class LoginController extends Controller
{
    public function getUsers(Request $request): JsonResponse
    {
        $users = DB::table('users')->get();
        return response()->json($users);
    }
    public function deleteUser(Request $request): JsonResponse
    {
        $deleted = DB::table('users')
            ->where('id', $request->userId)
            ->delete();
        return response()->json($deleted);
    }

    public function editUser(Request $request): JsonResponse
    {
        $updated = DB::table('users')
            ->where('id', $request->user_id)
            ->update([
                'name' => $request->username,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'psw' => $request->password,
                'authority' => $request->authority,
                'memo' => $request->memo,
            ]);

        return response()->json($updated);
    }
    /**
     * @param Request $request
     * @return JsonResponse
     */
    public function signup(Request $request): JsonResponse
    {
        $credentials = $request->validate([
            'username' => 'required|string|max:255',
            'email' => 'required|string|max:255|unique:users',
            'password' => 'required|string',
        ]);

        Auth::login(
            $user = User::create([
                'name' => $request->username,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'psw' => $request->password,
                'authority' => $request->authority,
                'memo' => $request->memo,
            ])
        );

        event(new Registered($user));

        return response()->json($user, 201);
    }

    /**
     * @param Request $request
     * @return JsonResponse
     */
    public function authenticate(Request $request): JsonResponse
    {
        $credentials = $request->validate([
            'email' => ['required'],
            'password' => ['required'],
        ]);

        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();
            $user = Auth::user();

            return response()->json($user);
        }

        return response()->json([
            'errors' => [
                'email' => 'The provided credentials do not match our records.',
            ],
        ]);
    }

    /**
     * @param Request $request
     * @return JsonResponse
     */
    public function logout(Request $request): JsonResponse
    {
        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return response()->json('Successfully logged out');
    }
}
