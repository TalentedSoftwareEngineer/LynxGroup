<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    use HasFactory;

    protected $table = 'reservation';

    /**
     * The attributes that are mass assignable.
     *
     * @var string[]
     */
    protected $fillable = [
        'shift_id',
        'therapist_id',
        'reserve_store',
        'nomination_id',
        'discount',
        'menu_id',
        'menu_payment_id',
        'extend_id',
        'extend_payment_id',
        'option_id',
        'option_payment_id',
        'card_fee',
        'reservation_from',
        'reservation_to',
        'fee',
        'customer_name',
        'customer_tel',
        'new_repeater',
        'customer_req',
        'treatment_memo',
        'contact_memo',
    ];
}
