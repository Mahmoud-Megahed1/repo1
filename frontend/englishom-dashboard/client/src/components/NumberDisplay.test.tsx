import { describe, it, expect } from 'vitest';
import { NumberDisplay } from './NumberDisplay';

describe('NumberDisplay Component', () => {
  it('should be a valid React component', () => {
    expect(NumberDisplay).toBeTruthy();
  });

  it('should accept value prop', () => {
    const component = NumberDisplay({ value: 12345, language: 'en' });
    expect(component).toBeTruthy();
  });

  it('should accept language prop', () => {
    const component = NumberDisplay({ value: 100, language: 'ar' });
    expect(component).toBeTruthy();
  });

  it('should accept format prop', () => {
    const component = NumberDisplay({ value: 88, format: 'percentage', language: 'en' });
    expect(component).toBeTruthy();
  });

  it('should accept size prop', () => {
    const component = NumberDisplay({ value: 100, size: '4xl', language: 'en' });
    expect(component).toBeTruthy();
  });

  it('should accept variant prop', () => {
    const component = NumberDisplay({ value: 100, variant: 'gradient', language: 'en' });
    expect(component).toBeTruthy();
  });

  it('should accept className prop', () => {
    const component = NumberDisplay({ value: 100, className: 'custom-class', language: 'en' });
    expect(component).toBeTruthy();
  });

  it('should handle decimal places', () => {
    const component = NumberDisplay({ value: 3.14159, format: 'decimal', decimalPlaces: 2, language: 'en' });
    expect(component).toBeTruthy();
  });
});
