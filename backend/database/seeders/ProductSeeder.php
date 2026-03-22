<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // List of real image filenames you have in storage/app/public/products/
        $images = [
            'aloe-vera-gel.jpg',
            'backpack.webp',
            'blender.webp',
            'cofee-maker.jpg',
            'desk-lamp.webp',
            'green-yoga-mat.jpg',
            'leather-wallet.webp',
            'men-running-shoes.jpg',
            'smart-watch.webp',
            'sunglass.jpg',
            'tshirt.webp',
            'watter-bottle.png',
            'headphone.webp',
            'whey-protein.webp',
            'yoga-mat.webp',
        ];

        $faker = \Faker\Factory::create();

        // Generate 500 products
        for ($i = 0; $i < 500; $i++) {
            DB::table('products')->insert([
                'name' => $faker->unique()->words(rand(2, 4), true), // unique product name
                'description' => $faker->paragraph(rand(1, 3)),
                'price' => $faker->randomFloat(2, 5, 200),
                'image' => '/storage/products/' . $faker->randomElement($images),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
