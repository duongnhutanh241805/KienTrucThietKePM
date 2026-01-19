package org.example.tax.strategy;

public class VATTax implements TaxStrategy {
    @Override
    public double calculate(double price) {
        return price * 0.1;
    }
}