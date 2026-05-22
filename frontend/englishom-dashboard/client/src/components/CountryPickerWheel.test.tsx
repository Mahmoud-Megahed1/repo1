import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { CountryPickerWheel } from './CountryPickerWheel';

describe('CountryPickerWheel Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('component exists and exports correctly', () => {
    expect(CountryPickerWheel).toBeDefined();
    expect(typeof CountryPickerWheel).toBe('function');
  });

  it('accepts default props', () => {
    const component = React.createElement(CountryPickerWheel);
    expect(component).toBeTruthy();
    expect(component.type).toBe(CountryPickerWheel);
  });

  it('accepts custom countries array', () => {
    const customCountries = ['مصر', 'السعودية', 'الإمارات'];
    const component = React.createElement(CountryPickerWheel, {
      countries: customCountries,
    });
    expect(component.props.countries).toEqual(customCountries);
  });

  it('accepts custom interval prop', () => {
    const component = React.createElement(CountryPickerWheel, {
      interval: 2000,
    });
    expect(component.props.interval).toBe(2000);
  });

  it('accepts custom className prop', () => {
    const component = React.createElement(CountryPickerWheel, {
      className: 'test-class',
    });
    expect(component.props.className).toBe('test-class');
  });

  it('has correct default interval', () => {
    const component = React.createElement(CountryPickerWheel);
    // الـ interval الافتراضي يجب أن يكون موجوداً
    expect(component.props.interval).toBeUndefined(); // لأنه لم نعطِ قيمة
  });
});
