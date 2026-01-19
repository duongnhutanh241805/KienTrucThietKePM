package org.example;


import org.example.order.decorator.BasicOrder;
import org.example.order.decorator.GiftWrap;
import org.example.order.decorator.Insurance;
import org.example.order.decorator.OrderService;
import org.example.order.strategy.FastShipping;
import org.example.order.strategy.ShippingStrategy;

public class Main {
    public static void main(String[] args) {

        System.out.println("=== STATE PATTERN ===");
        OrderContext order = new OrderContext();
        order.process();
        order.process();

        System.out.println("\n=== STRATEGY PATTERN ===");
        ShippingStrategy shipping = new FastShipping();
        shipping.ship();

        System.out.println("\n=== DECORATOR PATTERN ===");
        OrderService service = new BasicOrder();
        service = new GiftWrap(service);
        service = new Insurance(service);

        System.out.println(" Tổng tiền đơn hàng: " + service.cost());
    }
}