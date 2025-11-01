package com.example.shoppingcart;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@SpringBootApplication
@RestController
@RequestMapping("/cart")
public class ShoppingCartApplication {

    public static void main(String[] args) {
        SpringApplication.run(ShoppingCartApplication.class, args);
    }

    // ------------------ Models ------------------
    public static class Item {
        private String id;
        private String name;
        private int quantity;
        private double price;

        public Item() {}
        public Item(String id, String name, int quantity, double price) {
            this.id = id;
            this.name = name;
            this.quantity = quantity;
            this.price = price;
        }

        public String getId() { return id; }
        public String getName() { return name; }
        public int getQuantity() { return quantity; }
        public double getPrice() { return price; }

        public void setQuantity(int quantity) { this.quantity = quantity; }
    }

    // ------------------ Cart State ------------------
    private final List<Item> cart = new ArrayList<>();

    // ------------------ API Endpoints ------------------

    // Add item to cart
    @PostMapping("/add")
    public List<Item> addItem(@RequestBody Item newItem) {
        Optional<Item> existing = cart.stream()
                .filter(item -> item.getId().equals(newItem.getId()))
                .findFirst();

        if (existing.isPresent()) {
            existing.get().setQuantity(existing.get().getQuantity() + newItem.getQuantity());
        } else {
            cart.add(newItem);
        }

        return cart;
    }

    // Remove item from cart
    @PostMapping("/remove")
    public List<Item> removeItem(@RequestParam String id) {
        cart.removeIf(item -> item.getId().equals(id));
        return cart;
    }

    // View cart items
    @GetMapping("/items")
    public List<Item> viewCart() {
        return cart;
    }

    // Clear cart
    @PostMapping("/clear")
    public List<Item> clearCart() {
        cart.clear();
        return cart;
    }
}
