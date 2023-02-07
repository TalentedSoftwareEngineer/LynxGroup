<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Therapist extends Model
{
    use HasFactory;

    protected $table = 'therapist';

    /**
     * The attributes that are mass assignable.
     *
     * @var string[]
     */
    protected $fillable = [
        'therapist_name',
        'nomination_fee',
        'main_nomination_fee',
        'referrer',
        'therapist_email',
        'can_service',
        'therapist_memo',
        'shift_display_rank',
        'shift_isHiden',
        'shift_first_day',
        'shift_total_main_nomination',
    ];
}
