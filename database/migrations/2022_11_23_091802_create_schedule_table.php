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
        Schema::create('schedule', function (Blueprint $table) {
            $table->id();
            $table->string('schedule_title', 255)->nullable();
            $table->string('schedule_fromTime', 255)->nullable();
            $table->string('schedule_toTime', 255)->nullable();
            $table->string('schedule_inputter', 255)->nullable();
            $table->string('schedule_genre', 255)->nullable();
            $table->string('schedule_notificationTime', 255)->nullable();
            $table->string('schedule_staff_email', 255)->nullable();
            $table->string('schedule_memo', 512)->nullable();
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
        Schema::dropIfExists('schedule');
    }
};
