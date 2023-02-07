<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AccountExtend extends Model
{
    use HasFactory;

    protected $table = 'accountextend';

    /**
     * The attributes that are mass assignable.
     *
     * @var string[]
     */
    protected $fillable = [
        'accountCourse_name',
        'accountCourse_from',
        'accountCourse_to',
        'extend_during',
        'accountCourse_memo',
    ];
}
