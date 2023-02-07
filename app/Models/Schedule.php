<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Schedule extends Model
{
    use HasFactory;

    protected $table = 'schedule';

    /**
     * The attributes that are mass assignable.
     *
     * @var string[]
     */
    protected $fillable = [
        'schedule_title',
        'schedule_fromTime',
        'schedule_toTime',
        'schedule_inputter',
        'schedule_genre',
        'schedule_notificationTime',
        'schedule_staff_email',
        'schedule_memo',
    ];
}
