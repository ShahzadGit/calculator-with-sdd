/**
 * Integration Tests: Keyboard Input
 *
 * Tests for keyboard input handling in the Calculator component.
 * Following TDD principles - these tests should FAIL until implementation is complete.
 */

import { describe, it, expect } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Calculator from '@/components/Calculator';

describe('Keyboard Input Tests', () => {
  describe('T068: Keyboard number input (typing "5")', () => {
    it('should handle keyboard number input', async () => {
      const user = userEvent.setup();
      render(<Calculator />);

      const display = screen.getByRole('status', { name: /display/i });

      // Type number 5
      await user.keyboard('5');
      expect(display.textContent).toBe('5');
    });

    it('should handle multiple digit input', async () => {
      const user = userEvent.setup();
      render(<Calculator />);

      const display = screen.getByRole('status', { name: /display/i });

      // Type 123
      await user.keyboard('123');
      expect(display.textContent).toBe('123');
    });

    it('should handle all number keys 0-9', async () => {
      const user = userEvent.setup();
      render(<Calculator />);

      const display = screen.getByRole('status', { name: /display/i });

      // Type all digits (including leading zero)
      await user.keyboard('0123456789');
      expect(display.textContent).toBe('0123456789');
    });
  });

  describe('T069: Keyboard operation input (typing "+")', () => {
    it('should handle addition operator via keyboard', async () => {
      const user = userEvent.setup();
      render(<Calculator />);

      const display = screen.getByRole('status', { name: /display/i });

      // Type 5 + 3
      await user.keyboard('5');
      expect(display.textContent).toBe('5');

      await user.keyboard('+');
      expect(display.textContent).toBe('5');

      await user.keyboard('3');
      expect(display.textContent).toBe('3');
    });

    it('should handle subtraction operator via keyboard', async () => {
      const user = userEvent.setup();
      render(<Calculator />);

      const display = screen.getByRole('status', { name: /display/i });

      await user.keyboard('10-4');
      expect(display.textContent).toBe('4');
    });

    it('should handle multiplication operator via keyboard', async () => {
      const user = userEvent.setup();
      render(<Calculator />);

      const display = screen.getByRole('status', { name: /display/i });

      await user.keyboard('6*7');
      expect(display.textContent).toBe('7');
    });

    it('should handle division operator via keyboard', async () => {
      const user = userEvent.setup();
      render(<Calculator />);

      const display = screen.getByRole('status', { name: /display/i });

      await user.keyboard('20/4');
      expect(display.textContent).toBe('4');
    });

    it('should handle exponentiation operator via keyboard', async () => {
      const user = userEvent.setup();
      render(<Calculator />);

      const display = screen.getByRole('status', { name: /display/i });

      await user.keyboard('2^8');
      expect(display.textContent).toBe('8');
    });

    it('should handle modulus operator via keyboard', async () => {
      const user = userEvent.setup();
      render(<Calculator />);

      const display = screen.getByRole('status', { name: /display/i });

      await user.keyboard('17%5');
      expect(display.textContent).toBe('5');
    });
  });

  describe('T070: Enter key triggering calculation', () => {
    it('should calculate result when Enter key is pressed', async () => {
      const user = userEvent.setup();
      render(<Calculator />);

      const display = screen.getByRole('status', { name: /display/i });

      // Type 5 + 3 and press Enter
      await user.keyboard('5+3');
      await user.keyboard('{Enter}');

      expect(display.textContent).toBe('8');
    });

    it('should calculate result when = key is pressed', async () => {
      const user = userEvent.setup();
      render(<Calculator />);

      const display = screen.getByRole('status', { name: /display/i });

      // Type 10 - 4 and press =
      await user.keyboard('10-4=');

      expect(display.textContent).toBe('6');
    });
  });

  describe('T071: Full keyboard workflow ("5+3{Enter}")', () => {
    it('should perform complete calculation via keyboard', async () => {
      const user = userEvent.setup();
      render(<Calculator />);

      const display = screen.getByRole('status', { name: /display/i });

      // Complete workflow: 5 + 3 = 8
      await user.keyboard('5+3{Enter}');
      expect(display.textContent).toBe('8');
    });

    it('should handle multiple calculations via keyboard', async () => {
      const user = userEvent.setup();
      render(<Calculator />);

      const display = screen.getByRole('status', { name: /display/i });

      // First calculation: 5 + 3 = 8
      await user.keyboard('5+3{Enter}');
      expect(display.textContent).toBe('8');

      // Second calculation: 10 * 2 = 20
      await user.keyboard('10*2{Enter}');
      expect(display.textContent).toBe('20');
    });

    it('should handle decimal input via keyboard', async () => {
      const user = userEvent.setup();
      render(<Calculator />);

      const display = screen.getByRole('status', { name: /display/i });

      // Calculate 15.5 + 4.25 = 19.75
      await user.keyboard('15.5+4.25{Enter}');
      expect(display.textContent).toBe('19.75');
    });

    it('should handle negative numbers via keyboard', async () => {
      const user = userEvent.setup();
      render(<Calculator />);

      const display = screen.getByRole('status', { name: /display/i });

      // Calculate 3 - 8 = -5
      await user.keyboard('3-8{Enter}');
      expect(display.textContent).toBe('-5');
    });

    it('should handle all operations via keyboard', async () => {
      const user = userEvent.setup();
      render(<Calculator />);

      const display = screen.getByRole('status', { name: /display/i });

      // Test each operation
      await user.keyboard('10+5{Enter}');
      expect(display.textContent).toBe('15');

      await user.keyboard('10-5{Enter}');
      expect(display.textContent).toBe('5');

      await user.keyboard('10*5{Enter}');
      expect(display.textContent).toBe('50');

      await user.keyboard('10/5{Enter}');
      expect(display.textContent).toBe('2');

      await user.keyboard('2^3{Enter}');
      expect(display.textContent).toBe('8');

      await user.keyboard('17%5{Enter}');
      expect(display.textContent).toBe('2');
    });

    it('should handle Escape key to clear', async () => {
      const user = userEvent.setup();
      render(<Calculator />);

      const display = screen.getByRole('status', { name: /display/i });

      // Enter some numbers and clear
      await user.keyboard('123');
      expect(display.textContent).toBe('123');

      await user.keyboard('{Escape}');
      expect(display.textContent).toBe('0');
    });
  });
});
