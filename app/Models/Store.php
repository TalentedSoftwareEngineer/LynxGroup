<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Store extends Model
{
    use HasFactory;

    protected $table = 'store';

    /**
     * The attributes that are mass assignable.
     *
     * @var string[]
     */
    protected $fillable = ['store_name', 'store_area', 'store_memo'];
}
