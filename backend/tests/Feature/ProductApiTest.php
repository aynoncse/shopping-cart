<?php

namespace Tests\Feature;

use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_products_index_returns_standardized_response_with_meta(): void
    {
        Product::create([
            'name' => 'Product A',
            'description' => 'Description A',
            'price' => 10.00,
            'image' => '/storage/products/a.jpg',
        ]);

        Product::create([
            'name' => 'Product B',
            'description' => 'Description B',
            'price' => 20.00,
            'image' => '/storage/products/b.jpg',
        ]);

        $response = $this->getJson('/api/v1/products?per_page=1');

        $response
            ->assertOk()
            ->assertJson([
                'success' => true,
                'message' => 'Products retrieved successfully.',
            ])
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    ['id', 'name', 'description', 'price', 'image', 'created_at', 'updated_at'],
                ],
                'meta' => ['current_page', 'last_page', 'per_page', 'total'],
            ]);
    }
}
