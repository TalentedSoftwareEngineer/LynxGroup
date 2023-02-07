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
        Schema::create('therapist_tally', function (Blueprint $table) {
            $table->id();
            $table->string('tally_therapist', 255);
            $table->string('tally_date', 255)->nullable();
            $table->string('tally_unpaid', 255)->nullable();
            $table->tinyInteger('tally_check')->nullable();
            $table->string('tally_remarks', 255)->nullable();
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
        Schema::dropIfExists('therapist_tally');
    }
};
