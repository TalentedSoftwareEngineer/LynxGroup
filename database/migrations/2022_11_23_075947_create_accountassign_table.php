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
        Schema::create('accountassign', function (Blueprint $table) {
            $table->id();
            $table->string('accountCourse_name', 255)->nullable();
            $table->string('accountCourse_from', 255)->nullable();
            $table->string('accountCourse_to', 255)->nullable();
            $table->string('accountCourse_memo', 512)->nullable();
            $table->timestamp('created_at')->nullable()->nullable();
            $table->timestamp('updated_at')->nullable()->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('accountassign');
    }
};
