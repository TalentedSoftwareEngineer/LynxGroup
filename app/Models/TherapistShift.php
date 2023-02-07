<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TherapistShift extends Model
{
    use HasFactory;

    protected $table = 'therapist_shift';

    /**
     * The attributes that are mass assignable.
     *
     * @var string[]
     */
    protected $fillable = [
        'therapist_id',
        'therapist_name',
        'shift_fromTime',
        'shift_toTime',
        'shift_status',
        'shift_store',
    ];
}
