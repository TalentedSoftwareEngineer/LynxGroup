<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AccountMenu extends Model
{
    use HasFactory;

    protected $table = 'accountmenu';

    /**
     * The attributes that are mass assignable.
     *
     * @var string[]
     */
    protected $fillable = ['accountMenu_name', 'accountMenu_memo'];
}
