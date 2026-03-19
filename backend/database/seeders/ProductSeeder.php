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
                'name' => 'Aloe Vera Gel',
                'description' => 'Natural aloe vera gel for skin care and soothing relief.',
                'price' => 5.49,
                'image' => '/storage/products/aloe-vera-gel.jpg',
            ],
            [
                'name' => 'Backpack',
                'description' => 'Durable and stylish backpack for everyday use.',
                'price' => 39.99,
                'image' => '/storage/products/backpack.webp',
            ],
            [
                'name' => 'Blender',
                'description' => 'High-speed blender for smoothies and shakes.',
                'price' => 49.99,
                'image' => '/storage/products/blender.webp',
            ],
            [
                'name' => 'Coffee Maker',
                'description' => 'Automatic coffee maker with programmable timer.',
                'price' => 79.99,
                'image' => '/storage/products/cofee-maker.jpg',
            ],
            [
                'name' => 'Desk Lamp',
                'description' => 'LED desk lamp with adjustable brightness.',
                'price' => 24.99,
                'image' => '/storage/products/desk-lamp.webp',
            ],
            [
                'name' => 'Green Yoga Mat',
                'description' => 'Eco-friendly, non-slip yoga mat in green.',
                'price' => 18.99,
                'image' => '/storage/products/green-yoga-mat.jpg',
            ],
            [
                'name' => 'Leather Wallet',
                'description' => 'Genuine leather wallet with multiple card slots.',
                'price' => 29.99,
                'image' => '/storage/products/leather-wallet.webp',
            ],
            [
                'name' => 'Men\'s Running Shoes',
                'description' => 'Lightweight running shoes with cushioned sole.',
                'price' => 59.99,
                'image' => '/storage/products/men-running-shoes.jpg',
            ],
            [
                'name' => 'Smart Watch',
                'description' => 'Fitness tracker and smart watch with heart rate monitor.',
                'price' => 89.99,
                'image' => '/storage/products/smart-watch.webp',
            ],
            [
                'name' => 'Sunglasses',
                'description' => 'Polarized sunglasses with UV protection.',
                'price' => 19.99,
                'image' => '/storage/products/sunglass.jpg',
            ],
            [
                'name' => 'Cotton T-Shirt',
                'description' => 'Soft cotton t-shirt, available in various colors.',
                'price' => 12.99,
                'image' => '/storage/products/tshirt.webp',
            ],
            [
                'name' => 'Water Bottle',
                'description' => 'Stainless steel insulated water bottle.',
                'price' => 14.99,
                'image' => '/storage/products/watter-bottle.jpg',
            ],
            [
                'name' => 'Wireless Headphones',
                'description' => 'Noise-cancelling over-ear headphones.',
                'price' => 79.99,
                'image' => '/storage/products/wh950nb-black-01.webp',
            ],
            [
                'name' => 'Whey Protein Powder',
                'description' => 'Premium whey protein for muscle recovery.',
                'price' => 29.99,
                'image' => '/storage/products/whey-protein.webp',
            ],
            [
                'name' => 'Yoga Mat',
                'description' => 'Standard non-slip yoga mat for all levels.',
                'price' => 15.00,
                'image' => '/storage/products/yoga-mat.webp',
            ],
        ];

        foreach ($products as $product) {
            DB::table('products')->updateOrInsert(
                ['name' => $product['name']], // avoid duplicates if re-running
                [
                    'description' => $product['description'],
                    'price' => $product['price'],
                    'image' => $product['image'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }
    }
}
