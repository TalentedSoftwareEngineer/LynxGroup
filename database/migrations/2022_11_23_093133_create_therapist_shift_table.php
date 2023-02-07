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
        Schema::create('therapist_shift', function (Blueprint $table) {
            $table->id();
            $table->bigIncrements('therapist_id', 20)->nullable();
            $table->string('therapist_name', 255);
            $table->string('shift_fromTime', 255)->nullable();
            $table->string('shift_toTime', 255)->nullable();
            $table->string('shift_status', 255)->nullable();
            $table->string('shift_store', 255)->nullable();
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
        Schema::dropIfExists('therapist_shift');
    }
};
