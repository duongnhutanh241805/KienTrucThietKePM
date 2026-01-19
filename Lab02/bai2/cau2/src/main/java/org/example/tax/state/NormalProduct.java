package org.example.tax.state;

import org.example.tax.strategy.TaxStrategy;
import org.example.tax.strategy.VATTax;

public class NormalProduct implements ProductState {
    @Override
    public TaxStrategy getTaxStrategy() {
        return new VATTax();
    }
}
