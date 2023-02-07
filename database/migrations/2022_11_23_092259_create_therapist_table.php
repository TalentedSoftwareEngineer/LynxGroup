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
        Schema::create('therapist', function (Blueprint $table) {
            $table->id();
            $table->string('therapist_name', 255);
            $table->string('nomination_fee', 255)->nullable();
            $table->string('main_nomination_fee', 255)->nullable();
            $table->string('referrer', 255)->nullable();
            $table->string('therapist_email', 255)->nullable();
            $table->string('therapist_get_email', 255)->nullable();
            $table->string('can_service', 255)->nullable();
            $table->string('dedicated_url', 255)->nullable();
            $table->string('therapist_memo', 512)->nullable();
            $table->bigIncrements('shift_display_rank', 20)->nullable();
            $table->tinyInteger('shift_isHiden')->nullable();
            $table->string('shift_first_day', 255)->nullable();
            $table->string('shift_total_main_nomination', 255)->nullable();
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
        Schema::dropIfExists('therapist');
    }
};
