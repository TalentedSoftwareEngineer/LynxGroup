<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TherapistService extends Model
{
    use HasFactory;

    protected $table = 'therapist_service';

    /**
     * The attributes that are mass assignable.
     *
     * @var string[]
     */
    protected $fillable = ['therapist_serv_name', 'therapist_serv_memo'];
}
