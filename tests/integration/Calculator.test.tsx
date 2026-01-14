/**
 * Integration Tests: Calculator Component
 *
 * Full workflow tests for the Calculator component covering user interactions.
 * Following TDD principles - these tests should FAIL until implementation is complete.
 */

import { describe, it, expect } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Calculator from '@/components/Calculator';

describe('Calculator Integration Tests', () => {
  describe('T026: Full calculation workflow (5 + 3 = 8)', () => {
    it('should perform complete addition calculation from user input', async () => {
      const user = userEvent.setup();
      render(<Calculator />);

      // Verify initial display shows "0"
      const display = screen.getByRole('status', { name: /display/i });
      expect(display.textContent).toBe('0');

      // Click number 5
      const button5 = screen.getByRole('button', { name: 'Number 5' });
      await user.click(button5);
      expect(display.textContent).toBe('5');

      // Click + operation
      const addButton = screen.getByRole('button', { name: 'Add' });
      await user.click(addButton);
      expect(display.textContent).toBe('5');

      // Click number 3
      const button3 = screen.getByRole('button', { name: 'Number 3' });
      await user.click(button3);
      expect(display.textContent).toBe('3');

      // Click = button
      const equalsButton = screen.getByRole('button', { name: 'Calculate result' });
      await user.click(equalsButton);

      // Verify result is 8
      expect(display.textContent).toBe('8');
    });

    it('should handle multiple calculations in sequence', async () => {
      const user = userEvent.setup();
      render(<Calculator />);

      const display = screen.getByRole('status', { name: /display/i });

      // First calculation: 5 + 3 = 8
      await user.click(screen.getByRole('button', { name: 'Number 5' }));
      await user.click(screen.getByRole('button', { name: 'Add' }));
      await user.click(screen.getByRole('button', { name: 'Number 3' }));
      await user.click(screen.getByRole('button', { name: 'Calculate result' }));
      expect(display.textContent).toBe('8');

      // Second calculation: 8 - 2 = 6 (using result from first)
      await user.click(screen.getByRole('button', { name: 'Subtract' }));
      await user.click(screen.getByRole('button', { name: 'Number 2' }));
      await user.click(screen.getByRole('button', { name: 'Calculate result' }));
      expect(display.textContent).toBe('6');
    });
  });

  describe('T027: Decimal calculation (15.5 + 4.25 = 19.75)', () => {
    it('should perform calculation with decimal numbers', async () => {
      const user = userEvent.setup();
      render(<Calculator />);

      const display = screen.getByRole('status', { name: /display/i });

      // Enter 15.5
      await user.click(screen.getByRole('button', { name: 'Number 1' }));
      await user.click(screen.getByRole('button', { name: 'Number 5' }));
      await user.click(screen.getByRole('button', { name: 'Decimal point' }));
      await user.click(screen.getByRole('button', { name: 'Number 5' }));
      expect(display.textContent).toBe('15.5');

      // Click + operation
      await user.click(screen.getByRole('button', { name: 'Add' }));

      // Enter 4.25
      await user.click(screen.getByRole('button', { name: 'Number 4' }));
      await user.click(screen.getByRole('button', { name: 'Decimal point' }));
      await user.click(screen.getByRole('button', { name: 'Number 2' }));
      await user.click(screen.getByRole('button', { name: 'Number 5' }));
      expect(display.textContent).toBe('4.25');

      // Calculate
      await user.click(screen.getByRole('button', { name: 'Calculate result' }));

      // Verify result
      expect(display.textContent).toBe('19.75');
    });

    it('should handle division resulting in decimal', async () => {
      const user = userEvent.setup();
      render(<Calculator />);

      const display = screen.getByRole('status', { name: /display/i });

      // Calculate 7 ÷ 2 = 3.5
      await user.click(screen.getByRole('button', { name: 'Number 7' }));
      await user.click(screen.getByRole('button', { name: 'Divide' }));
      await user.click(screen.getByRole('button', { name: 'Number 2' }));
      await user.click(screen.getByRole('button', { name: 'Calculate result' }));

      expect(display.textContent).toBe('3.5');
    });

    it('should format decimal results correctly', async () => {
      const user = userEvent.setup();
      render(<Calculator />);

      const display = screen.getByRole('status', { name: /display/i });

      // Calculate 1 ÷ 3 (should format to reasonable precision)
      await user.click(screen.getByRole('button', { name: 'Number 1' }));
      await user.click(screen.getByRole('button', { name: 'Divide' }));
      await user.click(screen.getByRole('button', { name: 'Number 3' }));
      await user.click(screen.getByRole('button', { name: 'Calculate result' }));

      // Should show formatted decimal (e.g., "0.3333333333")
      const value = display.textContent || '';
      expect(value).toMatch(/^0\.3+$/);
      expect(value.length).toBeLessThanOrEqual(12); // max 10 decimals + "0."
    });
  });

  describe('T028: Negative number calculation (-10 + 5 = -5)', () => {
    it('should handle negative first operand', async () => {
      const user = userEvent.setup();
      render(<Calculator />);

      const display = screen.getByRole('status', { name: /display/i });

      // Enter -10 (using negative button or typing)
      const negativeButton = screen.getByRole('button', { name: 'Toggle negative' });
      await user.click(negativeButton);
      await user.click(screen.getByRole('button', { name: 'Number 1' }));
      await user.click(screen.getByRole('button', { name: 'Number 0' }));
      expect(display.textContent).toBe('-10');

      // Add 5
      await user.click(screen.getByRole('button', { name: 'Add' }));
      await user.click(screen.getByRole('button', { name: 'Number 5' }));

      // Calculate
      await user.click(screen.getByRole('button', { name: 'Calculate result' }));

      // Verify result
      expect(display.textContent).toBe('-5');
    });

    it('should handle subtraction resulting in negative', async () => {
      const user = userEvent.setup();
      render(<Calculator />);

      const display = screen.getByRole('status', { name: /display/i });

      // Calculate 3 - 8 = -5
      await user.click(screen.getByRole('button', { name: 'Number 3' }));
      await user.click(screen.getByRole('button', { name: 'Subtract' }));
      await user.click(screen.getByRole('button', { name: 'Number 8' }));
      await user.click(screen.getByRole('button', { name: 'Calculate result' }));

      expect(display.textContent).toBe('-5');
    });

    it('should handle multiplication with negative numbers', async () => {
      const user = userEvent.setup();
      render(<Calculator />);

      const display = screen.getByRole('status', { name: /display/i });

      // Calculate -5 × 3 = -15
      const negativeButton = screen.getByRole('button', { name: 'Toggle negative' });
      await user.click(negativeButton);
      await user.click(screen.getByRole('button', { name: 'Number 5' }));
      await user.click(screen.getByRole('button', { name: 'Multiply' }));
      await user.click(screen.getByRole('button', { name: 'Number 3' }));
      await user.click(screen.getByRole('button', { name: 'Calculate result' }));

      expect(display.textContent).toBe('-15');
    });

    it('should handle two negative numbers', async () => {
      const user = userEvent.setup();
      render(<Calculator />);

      const display = screen.getByRole('status', { name: /display/i });

      // Calculate -4 × -3 = 12
      const negativeButton = screen.getByRole('button', { name: 'Toggle negative' });
      await user.click(negativeButton);
      await user.click(screen.getByRole('button', { name: 'Number 4' }));
      await user.click(screen.getByRole('button', { name: 'Multiply' }));

      // Second negative number
      await user.click(negativeButton);
      await user.click(screen.getByRole('button', { name: 'Number 3' }));
      await user.click(screen.getByRole('button', { name: 'Calculate result' }));

      expect(display.textContent).toBe('12');
    });
  });

  describe('T043: Exponentiation calculation (2 ^ 8 = 256)', () => {
    it('should perform exponentiation calculation', async () => {
      const user = userEvent.setup();
      render(<Calculator />);

      const display = screen.getByRole('status', { name: /display/i });

      // Calculate 2 ^ 8 = 256
      await user.click(screen.getByRole('button', { name: 'Number 2' }));
      await user.click(screen.getByRole('button', { name: 'Exponentiate' }));
      await user.click(screen.getByRole('button', { name: 'Number 8' }));
      await user.click(screen.getByRole('button', { name: 'Calculate result' }));

      expect(display.textContent).toBe('256');
    });

    it('should handle base to power of zero', async () => {
      const user = userEvent.setup();
      render(<Calculator />);

      const display = screen.getByRole('status', { name: /display/i });

      // Calculate 5 ^ 0 = 1
      await user.click(screen.getByRole('button', { name: 'Number 5' }));
      await user.click(screen.getByRole('button', { name: 'Exponentiate' }));
      await user.click(screen.getByRole('button', { name: 'Number 0' }));
      await user.click(screen.getByRole('button', { name: 'Calculate result' }));

      expect(display.textContent).toBe('1');
    });

    it('should handle negative exponent', async () => {
      const user = userEvent.setup();
      render(<Calculator />);

      const display = screen.getByRole('status', { name: /display/i });

      // Calculate 2 ^ -3 = 0.125
      await user.click(screen.getByRole('button', { name: 'Number 2' }));
      await user.click(screen.getByRole('button', { name: 'Exponentiate' }));
      await user.click(screen.getByRole('button', { name: 'Toggle negative' }));
      await user.click(screen.getByRole('button', { name: 'Number 3' }));
      await user.click(screen.getByRole('button', { name: 'Calculate result' }));

      expect(display.textContent).toBe('0.125');
    });
  });

  describe('T044: Modulus calculation (17 % 5 = 2)', () => {
    it('should perform modulus calculation', async () => {
      const user = userEvent.setup();
      render(<Calculator />);

      const display = screen.getByRole('status', { name: /display/i });

      // Calculate 17 % 5 = 2
      await user.click(screen.getByRole('button', { name: 'Number 1' }));
      await user.click(screen.getByRole('button', { name: 'Number 7' }));
      await user.click(screen.getByRole('button', { name: 'Modulus' }));
      await user.click(screen.getByRole('button', { name: 'Number 5' }));
      await user.click(screen.getByRole('button', { name: 'Calculate result' }));

      expect(display.textContent).toBe('2');
    });

    it('should handle modulus with zero result', async () => {
      const user = userEvent.setup();
      render(<Calculator />);

      const display = screen.getByRole('status', { name: /display/i });

      // Calculate 10 % 5 = 0
      await user.click(screen.getByRole('button', { name: 'Number 1' }));
      await user.click(screen.getByRole('button', { name: 'Number 0' }));
      await user.click(screen.getByRole('button', { name: 'Modulus' }));
      await user.click(screen.getByRole('button', { name: 'Number 5' }));
      await user.click(screen.getByRole('button', { name: 'Calculate result' }));

      expect(display.textContent).toBe('0');
    });

    it('should handle modulus by zero with error', async () => {
      const user = userEvent.setup();
      render(<Calculator />);

      const display = screen.getByRole('status', { name: /display/i });

      // Calculate 10 % 0 = error
      await user.click(screen.getByRole('button', { name: 'Number 1' }));
      await user.click(screen.getByRole('button', { name: 'Number 0' }));
      await user.click(screen.getByRole('button', { name: 'Modulus' }));
      await user.click(screen.getByRole('button', { name: 'Number 0' }));
      await user.click(screen.getByRole('button', { name: 'Calculate result' }));

      expect(display.textContent).toBe('Cannot divide by zero');
    });
  });

  describe('T055: Division by zero error display', () => {
    it('should display error message for division by zero', async () => {
      const user = userEvent.setup();
      render(<Calculator />);

      const display = screen.getByRole('status', { name: /display/i });

      // Calculate 5 ÷ 0 = error
      await user.click(screen.getByRole('button', { name: 'Number 5' }));
      await user.click(screen.getByRole('button', { name: 'Divide' }));
      await user.click(screen.getByRole('button', { name: 'Number 0' }));
      await user.click(screen.getByRole('button', { name: 'Calculate result' }));

      expect(display.textContent).toBe('Cannot divide by zero');
    });

    it('should clear error on new input', async () => {
      const user = userEvent.setup();
      render(<Calculator />);

      const display = screen.getByRole('status', { name: /display/i });

      // Cause error
      await user.click(screen.getByRole('button', { name: 'Number 5' }));
      await user.click(screen.getByRole('button', { name: 'Divide' }));
      await user.click(screen.getByRole('button', { name: 'Number 0' }));
      await user.click(screen.getByRole('button', { name: 'Calculate result' }));
      expect(display.textContent).toBe('Cannot divide by zero');

      // Start new calculation
      await user.click(screen.getByRole('button', { name: 'Number 3' }));
      expect(display.textContent).toBe('3');
    });
  });

  describe('T056: Empty input error handling', () => {
    it('should handle calculation with no second operand', async () => {
      const user = userEvent.setup();
      render(<Calculator />);

      const display = screen.getByRole('status', { name: /display/i });

      // Try to calculate without second number: 5 + = ?
      await user.click(screen.getByRole('button', { name: 'Number 5' }));
      await user.click(screen.getByRole('button', { name: 'Add' }));
      await user.click(screen.getByRole('button', { name: 'Calculate result' }));

      // Should remain at 5 (no change without second operand)
      expect(display.textContent).toBe('5');
    });

    it('should handle calculation with no first operand', async () => {
      const user = userEvent.setup();
      render(<Calculator />);

      const display = screen.getByRole('status', { name: /display/i });

      // Try to calculate without entering a number first
      await user.click(screen.getByRole('button', { name: 'Add' }));
      await user.click(screen.getByRole('button', { name: 'Calculate result' }));

      // Should remain at 0
      expect(display.textContent).toBe('0');
    });
  });

  describe('T057: Invalid character rejection', () => {
    it('should only accept valid number characters from keypad', async () => {
      const user = userEvent.setup();
      render(<Calculator />);

      const display = screen.getByRole('status', { name: /display/i });

      // Enter valid sequence with decimal
      await user.click(screen.getByRole('button', { name: 'Number 1' }));
      await user.click(screen.getByRole('button', { name: 'Number 2' }));
      await user.click(screen.getByRole('button', { name: 'Decimal point' }));
      await user.click(screen.getByRole('button', { name: 'Number 3' }));

      expect(display.textContent).toBe('12.3');
    });

    it('should prevent multiple decimal points', async () => {
      const user = userEvent.setup();
      render(<Calculator />);

      const display = screen.getByRole('status', { name: /display/i });

      // Try to add multiple decimal points
      await user.click(screen.getByRole('button', { name: 'Number 1' }));
      await user.click(screen.getByRole('button', { name: 'Decimal point' }));
      await user.click(screen.getByRole('button', { name: 'Number 2' }));
      await user.click(screen.getByRole('button', { name: 'Decimal point' })); // Should be ignored
      await user.click(screen.getByRole('button', { name: 'Number 3' }));

      expect(display.textContent).toBe('1.23');
    });

    it('should handle negative sign correctly', async () => {
      const user = userEvent.setup();
      render(<Calculator />);

      const display = screen.getByRole('status', { name: /display/i });

      // Toggle negative
      await user.click(screen.getByRole('button', { name: 'Toggle negative' }));
      await user.click(screen.getByRole('button', { name: 'Number 5' }));
      expect(display.textContent).toBe('-5');

      // Toggle back to positive
      await user.click(screen.getByRole('button', { name: 'Toggle negative' }));
      expect(display.textContent).toBe('5');
    });
  });

  describe('T079: Clear button resetting calculator state', () => {
    it('should reset calculator state when clear button is clicked', async () => {
      const user = userEvent.setup();
      render(<Calculator />);

      const display = screen.getByRole('status', { name: /display/i });

      // Enter some numbers
      await user.click(screen.getByRole('button', { name: 'Number 1' }));
      await user.click(screen.getByRole('button', { name: 'Number 2' }));
      await user.click(screen.getByRole('button', { name: 'Number 3' }));
      expect(display.textContent).toBe('123');

      // Click clear button
      await user.click(screen.getByRole('button', { name: 'Clear calculator' }));
      expect(display.textContent).toBe('0');
    });

    it('should clear operation and previous value', async () => {
      const user = userEvent.setup();
      render(<Calculator />);

      const display = screen.getByRole('status', { name: /display/i });

      // Enter first number and operation
      await user.click(screen.getByRole('button', { name: 'Number 5' }));
      await user.click(screen.getByRole('button', { name: 'Add' }));
      await user.click(screen.getByRole('button', { name: 'Number 3' }));
      expect(display.textContent).toBe('3');

      // Click clear
      await user.click(screen.getByRole('button', { name: 'Clear calculator' }));
      expect(display.textContent).toBe('0');

      // Verify operation is cleared - entering number should start fresh
      await user.click(screen.getByRole('button', { name: 'Number 7' }));
      expect(display.textContent).toBe('7');
    });
  });

  describe('T080: Clear after result displayed', () => {
    it('should clear result and start new calculation', async () => {
      const user = userEvent.setup();
      render(<Calculator />);

      const display = screen.getByRole('status', { name: /display/i });

      // Perform calculation: 5 + 3 = 8
      await user.click(screen.getByRole('button', { name: 'Number 5' }));
      await user.click(screen.getByRole('button', { name: 'Add' }));
      await user.click(screen.getByRole('button', { name: 'Number 3' }));
      await user.click(screen.getByRole('button', { name: 'Calculate result' }));
      expect(display.textContent).toBe('8');

      // Click clear
      await user.click(screen.getByRole('button', { name: 'Clear calculator' }));
      expect(display.textContent).toBe('0');

      // Start new calculation: 10 - 4 = 6
      await user.click(screen.getByRole('button', { name: 'Number 1' }));
      await user.click(screen.getByRole('button', { name: 'Number 0' }));
      await user.click(screen.getByRole('button', { name: 'Subtract' }));
      await user.click(screen.getByRole('button', { name: 'Number 4' }));
      await user.click(screen.getByRole('button', { name: 'Calculate result' }));
      expect(display.textContent).toBe('6');
    });

    it('should allow multiple calculations after clear', async () => {
      const user = userEvent.setup();
      render(<Calculator />);

      const display = screen.getByRole('status', { name: /display/i });

      // First calculation
      await user.click(screen.getByRole('button', { name: 'Number 2' }));
      await user.click(screen.getByRole('button', { name: 'Multiply' }));
      await user.click(screen.getByRole('button', { name: 'Number 3' }));
      await user.click(screen.getByRole('button', { name: 'Calculate result' }));
      expect(display.textContent).toBe('6');

      // Clear and second calculation
      await user.click(screen.getByRole('button', { name: 'Clear calculator' }));
      await user.click(screen.getByRole('button', { name: 'Number 8' }));
      await user.click(screen.getByRole('button', { name: 'Divide' }));
      await user.click(screen.getByRole('button', { name: 'Number 2' }));
      await user.click(screen.getByRole('button', { name: 'Calculate result' }));
      expect(display.textContent).toBe('4');
    });
  });

  describe('T081: Clear after error displayed', () => {
    it('should clear error state and allow new calculation', async () => {
      const user = userEvent.setup();
      render(<Calculator />);

      const display = screen.getByRole('status', { name: /display/i });

      // Cause division by zero error
      await user.click(screen.getByRole('button', { name: 'Number 5' }));
      await user.click(screen.getByRole('button', { name: 'Divide' }));
      await user.click(screen.getByRole('button', { name: 'Number 0' }));
      await user.click(screen.getByRole('button', { name: 'Calculate result' }));
      expect(display.textContent).toBe('Cannot divide by zero');

      // Click clear
      await user.click(screen.getByRole('button', { name: 'Clear calculator' }));
      expect(display.textContent).toBe('0');

      // Start new calculation successfully
      await user.click(screen.getByRole('button', { name: 'Number 6' }));
      await user.click(screen.getByRole('button', { name: 'Add' }));
      await user.click(screen.getByRole('button', { name: 'Number 4' }));
      await user.click(screen.getByRole('button', { name: 'Calculate result' }));
      expect(display.textContent).toBe('10');
    });

    it('should clear modulus by zero error', async () => {
      const user = userEvent.setup();
      render(<Calculator />);

      const display = screen.getByRole('status', { name: /display/i });

      // Cause modulus by zero error
      await user.click(screen.getByRole('button', { name: 'Number 7' }));
      await user.click(screen.getByRole('button', { name: 'Modulus' }));
      await user.click(screen.getByRole('button', { name: 'Number 0' }));
      await user.click(screen.getByRole('button', { name: 'Calculate result' }));
      expect(display.textContent).toBe('Cannot divide by zero');

      // Clear and verify
      await user.click(screen.getByRole('button', { name: 'Clear calculator' }));
      expect(display.textContent).toBe('0');
    });
  });

  // ============================================================================
  // Phase 9: UI Integration Tests (T122-T125)
  // ============================================================================

  // T122: Verify integration tests work with new UI styling
  describe('T122: UI Styling Integration', () => {
    it('should render Calculator with glass-container styling', () => {
      render(<Calculator />);

      const calculator = screen.getByRole('region', { name: /calculator/i });
      expect(calculator.className).toMatch(/glass-container/);
      expect(calculator.className).toMatch(/shadow-2xl/);
    });

    it('should render all buttons with neomorphic styling', () => {
      render(<Calculator />);

      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button.className).toMatch(/neomorphic-raised/);
      });
    });

    it('should render buttons with animation classes', () => {
      render(<Calculator />);

      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button.className).toMatch(/animate-on-hover/);
        expect(button.className).toMatch(/transition-all/);
      });
    });
  });

  // T123: Complete calculation flow with new UI (pulse animation)
  describe('T123: Calculation Flow with Pulse Animation', () => {
    it('should show pulse animation class when result is calculated', async () => {
      const user = userEvent.setup();
      render(<Calculator />);

      // Perform calculation: 5 + 3 = 8
      await user.click(screen.getByRole('button', { name: 'Number 5' }));
      await user.click(screen.getByRole('button', { name: 'Add' }));
      await user.click(screen.getByRole('button', { name: 'Number 3' }));
      await user.click(screen.getByRole('button', { name: 'Calculate result' }));

      // Verify result displayed
      const display = screen.getByRole('status', { name: /display/i });
      expect(display.textContent).toBe('8');

      // Verify pulse animation class is applied when result is shown
      expect(display.className).toMatch(/animate-pulse-result/);
    });

    it('should complete full calculation workflow with all UI effects', async () => {
      const user = userEvent.setup();
      render(<Calculator />);

      const display = screen.getByRole('status', { name: /display/i });
      const calculator = screen.getByRole('region', { name: /calculator/i });

      // Verify initial state
      expect(display.textContent).toBe('0');
      expect(calculator.className).toMatch(/glass-container/);

      // Enter first number with UI effects
      const button7 = screen.getByRole('button', { name: 'Number 7' });
      expect(button7.className).toMatch(/neomorphic-raised/);
      await user.click(button7);
      expect(display.textContent).toBe('7');

      // Select operation
      const multiplyButton = screen.getByRole('button', { name: 'Multiply' });
      expect(multiplyButton.className).toMatch(/neomorphic-raised/);
      await user.click(multiplyButton);

      // Enter second number
      await user.click(screen.getByRole('button', { name: 'Number 6' }));
      expect(display.textContent).toBe('6');

      // Calculate with UI feedback
      const equalsButton = screen.getByRole('button', { name: 'Calculate result' });
      expect(equalsButton.className).toMatch(/neomorphic-raised/);
      await user.click(equalsButton);

      // Verify result with pulse animation
      expect(display.textContent).toBe('42');
      expect(display.className).toMatch(/animate-pulse-result/);
    });
  });

  // T124: Error handling flow with shake animation
  describe('T124: Error Handling Flow with Shake Animation', () => {
    it('should show shake animation class when error occurs', async () => {
      const user = userEvent.setup();
      render(<Calculator />);

      // Cause division by zero: 5 ÷ 0
      await user.click(screen.getByRole('button', { name: 'Number 5' }));
      await user.click(screen.getByRole('button', { name: 'Divide' }));
      await user.click(screen.getByRole('button', { name: 'Number 0' }));
      await user.click(screen.getByRole('button', { name: 'Calculate result' }));

      // Verify error displayed with shake animation
      const display = screen.getByRole('status', { name: /error/i });
      expect(display.textContent).toBe('Cannot divide by zero');
      expect(display.className).toMatch(/animate-shake-error/);
      expect(display.className).toMatch(/text-calculator-clear/);
    });

    it('should clear error and remove shake animation', async () => {
      const user = userEvent.setup();
      render(<Calculator />);

      // Cause error
      await user.click(screen.getByRole('button', { name: 'Number 8' }));
      await user.click(screen.getByRole('button', { name: 'Modulus' }));
      await user.click(screen.getByRole('button', { name: 'Number 0' }));
      await user.click(screen.getByRole('button', { name: 'Calculate result' }));

      // Verify error state
      let display = screen.getByRole('status', { name: /error/i });
      expect(display.className).toMatch(/animate-shake-error/);

      // Clear calculator
      await user.click(screen.getByRole('button', { name: 'Clear calculator' }));

      // Verify error cleared and no shake animation
      display = screen.getByRole('status', { name: /display/i });
      expect(display.textContent).toBe('0');
      expect(display.className).not.toMatch(/animate-shake-error/);
    });

    it('should recover from error with new calculation', async () => {
      const user = userEvent.setup();
      render(<Calculator />);

      // Cause error
      await user.click(screen.getByRole('button', { name: 'Number 1' }));
      await user.click(screen.getByRole('button', { name: 'Divide' }));
      await user.click(screen.getByRole('button', { name: 'Number 0' }));
      await user.click(screen.getByRole('button', { name: 'Calculate result' }));

      // Start new calculation (should clear error)
      await user.click(screen.getByRole('button', { name: 'Number 9' }));

      const display = screen.getByRole('status', { name: /display/i });
      expect(display.textContent).toBe('9');
      expect(display.className).not.toMatch(/animate-shake-error/);
      expect(display.className).toMatch(/text-calculator-text/);
    });
  });

  // T125: Keyboard navigation flow (already in keyboard-navigation.test.tsx)
  describe('T125: Keyboard Navigation with UI', () => {
    it('should have focus-ring class on all interactive buttons', () => {
      render(<Calculator />);

      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button.className).toMatch(/focus-ring/);
      });
    });

    it('should maintain UI styling during keyboard interaction', async () => {
      const user = userEvent.setup();
      render(<Calculator />);

      // Tab to first button and verify styling preserved
      await user.tab();
      const focusedButton = document.activeElement as HTMLElement;
      expect(focusedButton.className).toMatch(/neomorphic-raised/);
      expect(focusedButton.className).toMatch(/focus-ring/);
    });
  });
});
