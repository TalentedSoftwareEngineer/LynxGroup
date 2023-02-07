<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TherapistTally extends Model
{
    use HasFactory;

    protected $table = 'therapist_tally';

    /**
     * The attributes that are mass assignable.
     *
     * @var string[]
     */
    protected $fillable = ['tally_therapist', 'tally_date', 'tally_unpaid', 'tally_check', 'tally_remarks'];
}
