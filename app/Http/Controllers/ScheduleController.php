<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Schedule;

class ScheduleController extends Controller
{
    public function registSchedule(Request $request): JsonResponse
    {
        $registed = Schedule::create([
            'schedule_title' => $request->schedule_title,
            'schedule_fromTime' => $request->schedule_fromTime,
            'schedule_toTime' => $request->schedule_toTime,
            'schedule_inputter' => $request->schedule_inputter,
            'schedule_genre' => $request->schedule_genre,
            'schedule_notificationTime' => $request->schedule_notificationTime,
            'schedule_staff_email' => $request->schedule_staff_email,
            'schedule_memo' => $request->schedule_memo,
        ]);
        return response()->json($registed);
    }

    public function getSchedules(): JsonResponse
    {
        $result = DB::table('schedule')->get();
        return response()->json($result);
    }

    public function deleteSchedule(Request $request): JsonResponse
    {
        $deleted = DB::table('schedule')
            ->where('id', $request->scheduleId)
            ->delete();
        return response()->json($deleted);
    }

    public function editSchedule(Request $request): JsonResponse
    {
        $updated = DB::table('schedule')
            ->where('id', $request->scheduleId)
            ->update([
                'schedule_title' => $request->schedule_title,
                'schedule_fromTime' => $request->schedule_fromTime,
                'schedule_toTime' => $request->schedule_toTime,
                'schedule_inputter' => $request->schedule_inputter,
                'schedule_genre' => $request->schedule_genre,
                'schedule_notificationTime' =>
                    $request->schedule_notificationTime,
                'schedule_staff_email' => $request->schedule_staff_email,
                'schedule_memo' => $request->schedule_memo,
            ]);

        return response()->json($updated);
    }
}
