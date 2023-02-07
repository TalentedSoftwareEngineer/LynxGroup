<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AccountCourse extends Model
{
    use HasFactory;

    protected $table = 'accountcourse';

    /**
     * The attributes that are mass assignable.
     *
     * @var string[]
     */
    protected $fillable = [
        'accountCourse_name',
        'accountCourse_from',
        'accountCourse_to',
        'accountCourse_during',
        'accountCourse_memo',
    ];
}
