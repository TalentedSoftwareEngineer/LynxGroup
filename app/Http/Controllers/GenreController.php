<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Genre;

class GenreController extends Controller
{
    public function registGenre(Request $request): JsonResponse
    {
        $registed = Genre::create([
            'genre_name' => $request->genre_name,
            'genre_color' => $request->genre_color,
            'genre_memo' => $request->genre_memo,
        ]);
        return response()->json($registed);
    }

    public function getGenres(): JsonResponse
    {
        $result = DB::table('genre')->get();
        return response()->json($result);
    }

    public function deleteGenre(Request $request): JsonResponse
    {
        $deleted = DB::table('genre')
            ->where('id', $request->genreId)
            ->delete();
        return response()->json($deleted);
    }

    public function editGenre(Request $request): JsonResponse
    {
        $updated = DB::table('genre')
            ->where('id', $request->genreId)
            ->update([
                'genre_name' => $request->genre_name,
                'genre_color' => $request->genre_color,
                'genre_memo' => $request->genre_memo,
            ]);

        return response()->json($updated);
    }
}
