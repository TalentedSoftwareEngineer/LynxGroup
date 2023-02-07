<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CustomerMgr extends Model
{
    use HasFactory;

    protected $table = 'customer_mgr';

    /**
     * The attributes that are mass assignable.
     *
     * @var string[]
     */
    protected $fillable = ['reserve_id', 'usage_date', 'customer_name', 'therapist_name', 'ok_ng', 'memo'];
}
