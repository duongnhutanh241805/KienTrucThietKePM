package org.example.tax.state;

import org.example.tax.decorator.SpecialTax;
import org.example.tax.strategy.LuxuryTax;
import org.example.tax.strategy.TaxStrategy;

public class LuxuryProduct implements ProductState {
    @Override
    public TaxStrategy getTaxStrategy() {
        return new SpecialTax(new LuxuryTax());
    }
}
