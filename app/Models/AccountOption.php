<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AccountOption extends Model
{
    use HasFactory;

    protected $table = 'accountoption';

    /**
     * The attributes that are mass assignable.
     *
     * @var string[]
     */
    protected $fillable = [
        'accountCourse_name',
        'accountCourse_from',
        'accountCourse_to',
        'accountCourse_memo',
    ];
}
