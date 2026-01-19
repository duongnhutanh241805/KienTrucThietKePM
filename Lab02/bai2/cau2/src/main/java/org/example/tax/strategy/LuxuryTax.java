package org.example.tax.strategy;

public class LuxuryTax implements TaxStrategy {
    @Override
    public double calculate(double price) {
        return price * 0.2;
    }
}
