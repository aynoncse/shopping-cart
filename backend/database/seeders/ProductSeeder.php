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
                'image' => 'https://placehold.co/300',
            ],
            [
                'name' => 'Aloe Vera Gel',
                'description' => 'Natural aloe vera gel for skin care.',
                'price' => 5.49,
                'image' => 'https://placehold.co/300',
            ],
            [
                'name' => 'Whey Protein Powder',
                'description' => 'Premium whey protein for muscle recovery.',
                'price' => 29.99,
                'image' => 'https://placehold.co/300',
            ],
            [
                'name' => 'Yoga Mat',
                'description' => 'Comfortable non-slip yoga mat.',
                'price' => 15.00,
                'image' => 'https://placehold.co/300',
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
