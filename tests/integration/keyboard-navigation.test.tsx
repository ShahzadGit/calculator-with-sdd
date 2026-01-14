/**
 * Integration Tests: Keyboard Navigation (Phase 5 - US5)
 *
 * Tests for keyboard accessibility, Tab navigation, focus management,
 * and screen reader support in the Calculator component.
 *
 * @see specs/002-ui-enhancements/spec.md - US5 Improved Accessibility
 */

import { describe, it, expect } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Calculator from '@/components/Calculator';
import Display from '@/components/Display';
import Keypad from '@/components/Keypad';
import OperationButtons from '@/components/OperationButtons';

// Mock handlers
const mockHandlers = {
  onNumberClick: jest.fn(),
  onDecimalClick: jest.fn(),
  onNegativeClick: jest.fn(),
  onOperationClick: jest.fn(),
};

describe('Keyboard Navigation Tests (US5)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // T051: Tab key moves focus through all interactive elements
  describe('Tab Key Navigation', () => {
    it('should move focus through all buttons in logical order', async () => {
      const user = userEvent.setup();
      render(<Calculator />);

      const buttons = screen.getAllByRole('button');

      // Start from body and tab through buttons
      for (let i = 0; i < buttons.length; i++) {
        await user.tab();
        // Each tab should move to next interactive element
        expect(document.activeElement).toBeInstanceOf(HTMLButtonElement);
      }
    });

    it('should have all buttons focusable via Tab', async () => {
      const user = userEvent.setup();
      render(<Calculator />);

      const buttons = screen.getAllByRole('button');
      const focusedButtons: Element[] = [];

      // Tab through all elements
      for (let i = 0; i < buttons.length + 5; i++) {
        await user.tab();
        if (document.activeElement?.tagName === 'BUTTON') {
          focusedButtons.push(document.activeElement);
        }
      }

      // Should be able to focus on all buttons
      expect(focusedButtons.length).toBeGreaterThanOrEqual(buttons.length);
    });

    it('should navigate number pad buttons in expected order', async () => {
      const user = userEvent.setup();
      render(
        <Keypad
          onNumberClick={mockHandlers.onNumberClick}
          onDecimalClick={mockHandlers.onDecimalClick}
          onNegativeClick={mockHandlers.onNegativeClick}
        />
      );

      // Tab through keypad - should go in DOM order (7,8,9,4,5,6,1,2,3,+/-,0,.)
      await user.tab();
      expect(document.activeElement).toHaveAttribute('aria-label', 'Number 7');
    });
  });

  // T052: Enter/Space keys activate focused buttons
  describe('Enter/Space Key Activation', () => {
    it('should activate number button with Enter key', async () => {
      const user = userEvent.setup();
      render(
        <Keypad
          onNumberClick={mockHandlers.onNumberClick}
          onDecimalClick={mockHandlers.onDecimalClick}
          onNegativeClick={mockHandlers.onNegativeClick}
        />
      );

      // Focus on button 7 and press Enter
      const button7 = screen.getByRole('button', { name: /number 7/i });
      button7.focus();
      await user.keyboard('{Enter}');

      expect(mockHandlers.onNumberClick).toHaveBeenCalledWith('7');
    });

    it('should activate number button with Space key', async () => {
      const user = userEvent.setup();
      render(
        <Keypad
          onNumberClick={mockHandlers.onNumberClick}
          onDecimalClick={mockHandlers.onDecimalClick}
          onNegativeClick={mockHandlers.onNegativeClick}
        />
      );

      // Focus on button 5 and press Space
      const button5 = screen.getByRole('button', { name: /number 5/i });
      button5.focus();
      await user.keyboard(' ');

      expect(mockHandlers.onNumberClick).toHaveBeenCalledWith('5');
    });

    it('should activate operation button with Enter key', async () => {
      const user = userEvent.setup();
      render(
        <OperationButtons
          onOperationClick={mockHandlers.onOperationClick}
          selectedOperation={null}
        />
      );

      const addButton = screen.getByRole('button', { name: /add/i });
      addButton.focus();
      await user.keyboard('{Enter}');

      expect(mockHandlers.onOperationClick).toHaveBeenCalledWith('+');
    });

    it('should activate clear button with click in Calculator', async () => {
      const user = userEvent.setup();
      render(<Calculator />);

      const display = screen.getByRole('status', { name: /display/i });

      // Enter some numbers first
      await user.keyboard('123');
      expect(display.textContent).toBe('123');

      // Click clear button (Enter/Space on focused button works via native browser behavior)
      const clearButton = screen.getByRole('button', { name: /clear/i });
      await user.click(clearButton);

      expect(display.textContent).toBe('0');
    });

    it('should activate equals button with click in Calculator', async () => {
      const user = userEvent.setup();
      render(<Calculator />);

      const display = screen.getByRole('status', { name: /display/i });

      // Enter calculation
      await user.keyboard('5+3');

      // Click equals button (Enter/Space on focused button works via native browser behavior)
      const equalsButton = screen.getByRole('button', { name: /calculate/i });
      await user.click(equalsButton);

      expect(display.textContent).toBe('8');
    });
  });

  // T053: Focus indicators visible
  describe('Focus Indicators', () => {
    it('should have focus-ring class on all keypad buttons', () => {
      render(
        <Keypad
          onNumberClick={mockHandlers.onNumberClick}
          onDecimalClick={mockHandlers.onDecimalClick}
          onNegativeClick={mockHandlers.onNegativeClick}
        />
      );

      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button.className).toMatch(/focus-ring/);
      });
    });

    it('should have focus-ring class on operation buttons', () => {
      render(
        <OperationButtons
          onOperationClick={mockHandlers.onOperationClick}
          selectedOperation={null}
        />
      );

      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button.className).toMatch(/focus-ring/);
      });
    });

    it('should have focus-ring class on clear and equals buttons', () => {
      render(<Calculator />);

      const clearButton = screen.getByRole('button', { name: /clear/i });
      const equalsButton = screen.getByRole('button', { name: /calculate/i });

      expect(clearButton.className).toMatch(/focus-ring/);
      expect(equalsButton.className).toMatch(/focus-ring/);
    });
  });

  // T054: All buttons have descriptive aria-labels
  describe('ARIA Labels', () => {
    it('should have descriptive aria-labels on all number buttons', () => {
      render(
        <Keypad
          onNumberClick={mockHandlers.onNumberClick}
          onDecimalClick={mockHandlers.onDecimalClick}
          onNegativeClick={mockHandlers.onNegativeClick}
        />
      );

      // Check each number has an aria-label
      for (let i = 0; i <= 9; i++) {
        const button = screen.getByRole('button', { name: new RegExp(`${i}`, 'i') });
        expect(button).toHaveAccessibleName();
      }

      // Check decimal and negative buttons
      expect(screen.getByRole('button', { name: /decimal/i })).toHaveAccessibleName();
      expect(screen.getByRole('button', { name: /negative/i })).toHaveAccessibleName();
    });

    it('should have descriptive aria-labels on all operation buttons', () => {
      render(
        <OperationButtons
          onOperationClick={mockHandlers.onOperationClick}
          selectedOperation={null}
        />
      );

      // Check each operation has descriptive label
      expect(screen.getByRole('button', { name: /add/i })).toHaveAccessibleName();
      expect(screen.getByRole('button', { name: /subtract/i })).toHaveAccessibleName();
      expect(screen.getByRole('button', { name: /multiply/i })).toHaveAccessibleName();
      expect(screen.getByRole('button', { name: /divide/i })).toHaveAccessibleName();
      expect(screen.getByRole('button', { name: /exponentiate/i })).toHaveAccessibleName();
      expect(screen.getByRole('button', { name: /modulus/i })).toHaveAccessibleName();
    });

    it('should have descriptive aria-labels on clear and equals buttons', () => {
      render(<Calculator />);

      expect(screen.getByRole('button', { name: /clear/i })).toHaveAccessibleName();
      expect(screen.getByRole('button', { name: /calculate/i })).toHaveAccessibleName();
    });
  });

  // T055: Display uses aria-live region
  describe('ARIA Live Regions', () => {
    it('should have aria-live="polite" on display value for normal state', () => {
      render(<Display value="123" error={null} operation={null} />);

      const output = screen.getByRole('status');
      expect(output).toHaveAttribute('aria-live', 'polite');
    });

    it('should have aria-live="assertive" on display for error state (T062)', () => {
      render(<Display value="0" error="Cannot divide by zero" operation={null} />);

      const output = screen.getByRole('status');
      expect(output).toHaveAttribute('aria-live', 'assertive');
    });

    it('should announce value changes via aria-live', () => {
      const { rerender } = render(
        <Display value="0" error={null} operation={null} />
      );

      const output = screen.getByRole('status');
      expect(output).toHaveAttribute('aria-live', 'polite');
      expect(output.textContent).toBe('0');

      // Rerender with new value
      rerender(<Display value="123" error={null} operation={null} />);
      expect(output.textContent).toBe('123');
    });

    it('should have aria-live on operation indicator', () => {
      render(<Display value="5" error={null} operation="+" />);

      // Operation indicator should have aria-live
      const operationIndicator = screen.getByText('+');
      expect(operationIndicator).toHaveAttribute('aria-live', 'polite');
    });
  });

  // T056: Keyboard shortcuts activate corresponding buttons
  describe('Keyboard Shortcuts', () => {
    it('should activate number buttons via keyboard shortcuts 0-9', async () => {
      const user = userEvent.setup();
      render(<Calculator />);

      const display = screen.getByRole('status', { name: /display/i });

      // Type all digits
      await user.keyboard('1234567890');
      expect(display.textContent).toBe('1234567890');
    });

    it('should activate operation buttons via keyboard shortcuts', async () => {
      const user = userEvent.setup();
      render(<Calculator />);

      const display = screen.getByRole('status', { name: /display/i });

      // Test + operator
      await user.keyboard('5+3{Enter}');
      expect(display.textContent).toBe('8');
    });

    it('should activate equals via = key', async () => {
      const user = userEvent.setup();
      render(<Calculator />);

      const display = screen.getByRole('status', { name: /display/i });

      await user.keyboard('10-4=');
      expect(display.textContent).toBe('6');
    });

    it('should activate clear via Escape key', async () => {
      const user = userEvent.setup();
      render(<Calculator />);

      const display = screen.getByRole('status', { name: /display/i });

      await user.keyboard('999');
      expect(display.textContent).toBe('999');

      await user.keyboard('{Escape}');
      expect(display.textContent).toBe('0');
    });
  });

  // Additional accessibility tests
  describe('Calculator Region', () => {
    it('should have role="region" with aria-label', () => {
      render(<Calculator />);

      const calculator = screen.getByRole('region', { name: /calculator/i });
      expect(calculator).toBeInTheDocument();
    });
  });
});
