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
        $products = [
            [
                'name' => 'Protein Pancakes',
                'description' => 'High-protein pancakes for a healthy breakfast.',
                'price' => 9.99,
                'image' => 'products/protein-pancakes.jpg',
            ],
            [
                'name' => 'Aloe Vera Gel',
                'description' => 'Natural aloe vera gel for skin care.',
                'price' => 5.49,
                'image' => 'products/aloe-vera-gel.jpg',
            ],
            [
                'name' => 'Whey Protein Powder',
                'description' => 'Premium whey protein for muscle recovery.',
                'price' => 29.99,
                'image' => 'products/whey-protein.jpg',
            ],
            [
                'name' => 'Yoga Mat',
                'description' => 'Comfortable non-slip yoga mat.',
                'price' => 15.00,
                'image' => 'products/yoga-mat.jpg',
            ],
        ];

        foreach ($products as $product) {
            DB::table('products')->insert([
                'name' => $product['name'],
                'description' => $product['description'],
                'price' => $product['price'],
                'image' => $product['image'] ?? null,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
