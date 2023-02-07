<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('reservation', function (Blueprint $table) {
            $table->id();
            $table->string('shift_id', 255)->nullable();
            $table->string('therapist_id', 255)->nullable();
            $table->string('reserve_store', 255)->nullable();
            $table->string('nomination_id', 255)->nullable();
            $table->string('discount', 255)->nullable();
            $table->string('menu_id', 255)->nullable();
            $table->string('menu_payment_id', 255)->nullable();
            $table->string('extend_id', 255)->nullable();
            $table->string('extend_payment_id', 255)->nullable();
            $table->string('option_id', 255)->nullable();
            $table->string('option_payment_id', 255)->nullable();
            $table->string('card_fee', 255)->nullable();
            $table->string('reservation_from', 255)->nullable();
            $table->string('reservation_to', 255)->nullable();
            $table->string('fee', 255)->nullable();
            $table->string('customer_name', 255)->nullable();
            $table->string('customer_tel', 255)->nullable();
            $table->string('new_repeater', 255)->nullable();
            $table->string('customer_req', 512)->nullable();
            $table->string('treatment_memo', 512)->nullable();
            $table->string('contact_memo', 512)->nullable();
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('reservation');
    }
};
