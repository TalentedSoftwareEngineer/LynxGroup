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
        Schema::create('customer_mgr', function (Blueprint $table) {
            $table->id();
            $table->string('reserve_id', 127)->nullable();
            $table->string('usage_date', 255)->nullable();
            $table->string('customer_name', 255)->nullable();
            $table->string('therapist_name', 255)->nullable();
            $table->string('ok_ng', 20)->nullable();
            $table->string('memo', 512)->nullable();
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
        Schema::dropIfExists('customer_mgr');
    }
};
