// Products Data
const productsData = [
    {
        id: 1,
        title: "Premium Cotton T-Shirt",
        description: "High-quality cotton t-shirt with comfortable fit and stylish design. Perfect for casual wear and everyday comfort.",
        price: 2500,
        originalPrice: 3500,
        images: [
            "https://drpro777.github.io/photo-driver/1.webp",
            "https://images.pexels.com/photos/8532617/pexels-photo-8532617.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
            "https://images.pexels.com/photos/8532618/pexels-photo-8532618.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
            "https://images.pexels.com/photos/8532619/pexels-photo-8532619.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop"
        ],
        category: "men",
        rating: 4.5,
        reviews: 120,
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: ["Black", "White", "Navy", "Gray"],
        stock: 50,
        discount: 35
    },
    {
        id: 2,
        title: "Elegant Maxi Dress",
        description: "Beautiful flowing maxi dress perfect for special occasions. Made from premium fabric with elegant design details.",
        price: 4500,
        originalPrice: 6000,
        images: [
            "https://drpro777.github.io/photo-driver/2.jpg",
            "https://images.pexels.com/photos/1536620/pexels-photo-1536620.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
            "https://images.pexels.com/photos/1536621/pexels-photo-1536621.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
            "https://images.pexels.com/photos/1536622/pexels-photo-1536622.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop"
        ],
        category: "women",
        rating: 4.8,
        reviews: 85,
        sizes: ["XS", "S", "M", "L", "XL"],
        colors: ["Red", "Black", "Navy", "Emerald"],
        stock: 30,
        discount: 25
    },
    {
        id: 3,
        title: "Classic Denim Jeans",
        description: "Comfortable and durable denim jeans with classic fit. Perfect for everyday wear with premium quality fabric.",
        price: 3500,
        originalPrice: null,
        images: [
            "https://drpro777.github.io/photo-driver/3.jpg",
            "https://images.pexels.com/photos/1598508/pexels-photo-1598508.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
            "https://images.pexels.com/photos/1598509/pexels-photo-1598509.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
            "https://images.pexels.com/photos/1598510/pexels-photo-1598510.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop"
        ],
        category: "men",
        rating: 4.3,
        reviews: 200,
        sizes: ["28", "30", "32", "34", "36", "38"],
        colors: ["Blue", "Black", "Gray"],
        stock: 75,
        discount: 0
    },
    {
        id: 4,
        title: "Stylish Handbag",
        description: "Fashionable handbag with premium leather finish. Perfect accessory for any outfit with spacious interior.",
        price: 3200,
        originalPrice: 4000,
        images: [
            "https://drpro777.github.io/photo-driver/4.webp",
            "https://images.pexels.com/photos/1152078/pexels-photo-1152078.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
            "https://images.pexels.com/photos/1152079/pexels-photo-1152079.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
            "https://images.pexels.com/photos/1152080/pexels-photo-1152080.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop"
        ],
        category: "accessories",
        rating: 4.6,
        reviews: 95,
        sizes: ["One Size"],
        colors: ["Black", "Brown", "Tan", "Red"],
        stock: 25,
        discount: 20
    },
    {
        id: 5,
        title: "Casual Polo Shirt",
        description: "Comfortable polo shirt perfect for casual and semi-formal occasions. Premium quality cotton blend fabric.",
        price: 2800,
        originalPrice: null,
        images: [
            "https://drpro777.github.io/photo-driver/5.jpg",
            "https://images.pexels.com/photos/1040946/pexels-photo-1040946.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
            "https://images.pexels.com/photos/1040947/pexels-photo-1040947.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
            "https://images.pexels.com/photos/1040948/pexels-photo-1040948.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop"
        ],
        category: "men",
        rating: 4.2,
        reviews: 150,
        sizes: ["S", "M", "L", "XL"],
        colors: ["White", "Navy", "Green", "Gray"],
        stock: 40,
        discount: 0
    },
    {
        id: 6,
        title: "Summer Blouse",
        description: "Light and airy summer blouse with beautiful floral patterns. Perfect for warm weather and casual outings.",
        price: 2200,
        originalPrice: 3000,
        images: [
            "https://drpro777.github.io/photo-driver/6.webp",
            "https://images.pexels.com/photos/1549201/pexels-photo-1549201.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
            "https://images.pexels.com/photos/1549202/pexels-photo-1549202.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
            "https://images.pexels.com/photos/1549203/pexels-photo-1549203.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop"
        ],
        category: "women",
        rating: 4.4,
        reviews: 75,
        sizes: ["XS", "S", "M", "L"],
        colors: ["Pink", "White", "Blue", "Yellow"],
        stock: 35,
        discount: 27
    },
    {
        id: 7,
        title: "Leather Wallet",
        description: "Premium leather wallet with multiple card slots and cash compartments. Durable and stylish accessory.",
        price: 1800,
        originalPrice: null,
        images: [
            "https://drpro777.github.io/photo-driver/8.jpeg",
            "https://images.pexels.com/photos/1599821/pexels-photo-1599821.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
            "https://images.pexels.com/photos/1599822/pexels-photo-1599822.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
            "https://images.pexels.com/photos/1599823/pexels-photo-1599823.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop"
        ],
        category: "accessories",
        rating: 4.7,
        reviews: 110,
        sizes: ["One Size"],
        colors: ["Black", "Brown", "Tan"],
        stock: 60,
        discount: 0
    },
    {
        id: 8,
        title: "Formal Blazer",
        description: "Elegant formal blazer perfect for business meetings and special events. Tailored fit with premium fabric.",
        price: 6500,
        originalPrice: 8500,
        images: [
            "https://drpro777.github.io/photo-driver/9.webp",
            "https://images.pexels.com/photos/996330/pexels-photo-996330.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
            "https://images.pexels.com/photos/996331/pexels-photo-996331.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
            "https://images.pexels.com/photos/996332/pexels-photo-996332.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop"
        ],
        category: "men",
        rating: 4.9,
        reviews: 65,
        sizes: ["S", "M", "L", "XL"],
        colors: ["Navy", "Black", "Gray", "Charcoal"],
        stock: 20,
        discount: 24
    },
    {
        id: 9,
        title: "Casual Sneakers",
        description: "Comfortable casual sneakers perfect for daily wear. Lightweight design with excellent cushioning and support.",
        price: 4200,
        originalPrice: 5500,
        images: [
            "https://drpro777.github.io/photo-driver/10.webp",
            "https://images.pexels.com/photos/2529149/pexels-photo-2529149.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
            "https://images.pexels.com/photos/2529150/pexels-photo-2529150.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
            "https://images.pexels.com/photos/2529151/pexels-photo-2529151.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop"
        ],
        category: "accessories",
        rating: 4.3,
        reviews: 180,
        sizes: ["7", "8", "9", "10", "11", "12"],
        colors: ["White", "Black", "Gray", "Blue"],
        stock: 45,
        discount: 24
    },
    {
        id: 10,
        title: "Evening Gown",
        description: "Stunning evening gown perfect for formal events and special occasions. Elegant design with premium fabric.",
        price: 8500,
        originalPrice: 12000,
        images: [
            "https://drpro777.github.io/photo-driver/12.jpg",
            "https://images.pexels.com/photos/1721559/pexels-photo-1721559.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
            "https://images.pexels.com/photos/1721560/pexels-photo-1721560.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
            "https://images.pexels.com/photos/1721561/pexels-photo-1721561.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop"
        ],
        category: "women",
        rating: 4.9,
        reviews: 45,
        sizes: ["XS", "S", "M", "L"],
        colors: ["Black", "Navy", "Burgundy", "Emerald"],
        stock: 15,
        discount: 29
    },
    {
        id: 11,
        title: "Sports Watch",
        description: "Modern sports watch with multiple features including stopwatch, alarm, and water resistance. Perfect for active lifestyle.",
        price: 3800,
        originalPrice: null,
        images: [
            "https://drpro777.github.io/photo-driver/11.jpg",
            "https://images.pexels.com/photos/277320/pexels-photo-277320.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
            "https://images.pexels.com/photos/277321/pexels-photo-277321.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
            "https://images.pexels.com/photos/277322/pexels-photo-277322.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop"
        ],
        category: "accessories",
        rating: 4.5,
        reviews: 90,
        sizes: ["One Size"],
        colors: ["Black", "Silver", "Blue", "Red"],
        stock: 35,
        discount: 0
    },
    {
        id: 12,
        title: "Winter Jacket",
        description: "Warm and stylish winter jacket with excellent insulation. Perfect for cold weather with water-resistant material.",
        price: 5500,
        originalPrice: 7500,
        images: [
            "https://drpro777.github.io/photo-driver/13.jpg",
            "https://images.pexels.com/photos/1080697/pexels-photo-1080697.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
            "https://images.pexels.com/photos/1080698/pexels-photo-1080698.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
            "https://images.pexels.com/photos/1080699/pexels-photo-1080699.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop"
        ],
        category: "men",
        rating: 4.6,
        reviews: 70,
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: ["Black", "Navy", "Brown", "Gray"],
        stock: 0, // Out of stock
        discount: 27
    },
    {
        id: 13,
        title: "Silk Scarf",
        description: "Luxurious silk scarf with beautiful patterns. Perfect accessory to elevate any outfit with premium quality silk.",
        price: 2800,
        originalPrice: 3500,
        images: [
            "https://drpro777.github.io/photo-driver/14.jpg",
            "https://images.pexels.com/photos/1488464/pexels-photo-1488464.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
            "https://images.pexels.com/photos/1488465/pexels-photo-1488465.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
            "https://images.pexels.com/photos/1488466/pexels-photo-1488466.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop"
        ],
        category: "accessories",
        rating: 4.4,
        reviews: 55,
        sizes: ["One Size"],
        colors: ["Pink", "Blue", "Gold", "Purple"],
        stock: 28,
        discount: 20
    },
    {
        id: 14,
        title: "Casual Shorts",
        description: "Comfortable cotton shorts perfect for summer and casual wear. Lightweight fabric with modern fit.",
        price: 1800,
        originalPrice: null,
        images: [
            "https://drpro777.github.io/photo-driver/15.jpg",
            "https://images.pexels.com/photos/1598506/pexels-photo-1598506.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
            "https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
            "https://images.pexels.com/photos/1598508/pexels-photo-1598508.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop"
        ],
        category: "men",
        rating: 4.1,
        reviews: 125,
        sizes: ["S", "M", "L", "XL"],
        colors: ["Khaki", "Navy", "Black", "Olive"],
        stock: 55,
        discount: 0
    },
    {
        id: 15,
        title: "Floral Dress",
        description: "Beautiful floral dress perfect for spring and summer. Comfortable fit with vibrant colors and elegant design.",
        price: 3200,
        originalPrice: 4200,
        images: [
            "https://drpro777.github.io/photo-driver/16.jpg",
            "https://images.pexels.com/photos/1536620/pexels-photo-1536620.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
            "https://images.pexels.com/photos/1536621/pexels-photo-1536621.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
            "https://images.pexels.com/photos/1536622/pexels-photo-1536622.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop"
        ],
        category: "women",
        rating: 4.5,
        reviews: 85,
        sizes: ["XS", "S", "M", "L", "XL"],
        colors: ["Pink", "Blue", "Yellow", "White"],
        stock: 40,
        discount: 24
    },
    {
        id: 16,
        title: "Designer Sunglasses",
        description: "Stylish designer sunglasses with UV protection. Premium quality lenses and fashionable frames.",
        price: 2500,
        originalPrice: 3200,
        images: [
            "https://drpro777.github.io/photo-driver/17.jpg",
            "https://images.pexels.com/photos/1499328/pexels-photo-1499328.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
            "https://images.pexels.com/photos/1499329/pexels-photo-1499329.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
            "https://images.pexels.com/photos/1499330/pexels-photo-1499330.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop"
        ],
        category: "accessories",
        rating: 4.6,
        reviews: 78,
        sizes: ["One Size"],
        colors: ["Black", "Brown", "Gold", "Silver"],
        stock: 30,
        discount: 22
    },
    {
        id: 17,
        title: "Hoodie Sweatshirt",
        description: "Comfortable hoodie sweatshirt perfect for casual wear and lounging. Soft fabric with modern design.",
        price: 3500,
        originalPrice: null,
        images: [
            "https://drpro777.github.io/photo-driver/18.jpg",
            "https://images.pexels.com/photos/8532617/pexels-photo-8532617.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
            "https://images.pexels.com/photos/8532618/pexels-photo-8532618.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
            "https://images.pexels.com/photos/8532619/pexels-photo-8532619.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop"
        ],
        category: "men",
        rating: 4.3,
        reviews: 140,
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: ["Gray", "Black", "Navy", "Maroon"],
        stock: 45,
        discount: 0
    },
    {
        id: 18,
        title: "High Heels",
        description: "Elegant high heel shoes perfect for formal events and special occasions. Comfortable and stylish design.",
        price: 4500,
        originalPrice: 6000,
        images: [
            "https://drpro777.github.io/photo-driver/18.jpg",
            "https://images.pexels.com/photos/1464626/pexels-photo-1464626.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
            "https://images.pexels.com/photos/1464627/pexels-photo-1464627.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
            "https://images.pexels.com/photos/1464628/pexels-photo-1464628.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop"
        ],
        category: "women",
        rating: 4.2,
        reviews: 95,
        sizes: ["5", "6", "7", "8", "9", "10"],
        colors: ["Black", "Red", "Nude", "Silver"],
        stock: 25,
        discount: 25
    },
    {
        id: 19,
        title: "Baseball Cap",
        description: "Classic baseball cap with adjustable strap. Perfect for sports activities and casual wear.",
        price: 1200,
        originalPrice: 1500,
        images: [
            "https://drpro777.github.io/photo-driver/19.webp",
            "https://images.pexels.com/photos/1124063/pexels-photo-1124063.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
            "https://images.pexels.com/photos/1124064/pexels-photo-1124064.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
            "https://images.pexels.com/photos/1124065/pexels-photo-1124065.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop"
        ],
        category: "accessories",
        rating: 4.0,
        reviews: 160,
        sizes: ["One Size"],
        colors: ["Black", "Navy", "Red", "White"],
        stock: 70,
        discount: 20
    },
    {
        id: 20,
        title: "Cardigan Sweater",
        description: "Cozy cardigan sweater perfect for layering. Soft knit fabric with classic button-up design.",
        price: 4200,
        originalPrice: 5500,
        images: [
            "https://drpro777.github.io/photo-driver/20.jpg",
            "https://images.pexels.com/photos/1549201/pexels-photo-1549201.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
            "https://images.pexels.com/photos/1549202/pexels-photo-1549202.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
            "https://images.pexels.com/photos/1549203/pexels-photo-1549203.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop"
        ],
        category: "women",
        rating: 4.4,
        reviews: 110,
        sizes: ["XS", "S", "M", "L", "XL"],
        colors: ["Beige", "Gray", "Pink", "Navy"],
        stock: 0, 
        discount: 24
    },
      {
        id: 21,
        title: "Cardigan Sweater",
        description: "Cozy cardigan sweater perfect for layering. Soft knit fabric with classic button-up design.",
        price: 4200,
        originalPrice: 5500,
        images: [
            "https://drpro777.github.io/photo-driver/20.jpg",
            "https://images.pexels.com/photos/1549201/pexels-photo-1549201.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
            "https://images.pexels.com/photos/1549202/pexels-photo-1549202.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
            "https://images.pexels.com/photos/1549203/pexels-photo-1549203.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop"
        ],
        category: "women",
        rating: 4.4,
        reviews: 110,
        sizes: ["XS", "S", "M", "L", "XL"],
        colors: ["Beige", "Gray", "Pink", "Navy"],
        stock: 2, 
        discount: 24
    },
];

