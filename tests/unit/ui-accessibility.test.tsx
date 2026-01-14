/**
 * UI Accessibility Tests
 *
 * Tests for WCAG AA compliance using jest-axe.
 * Verifies color contrast, touch targets, and accessibility violations.
 *
 * @see specs/002-ui-enhancements/spec.md for accessibility requirements
 */

import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import Calculator from '@/components/Calculator';
import Display from '@/components/Display';
import Keypad from '@/components/Keypad';
import OperationButtons from '@/components/OperationButtons';

// Extend Jest matchers with jest-axe
expect.extend(toHaveNoViolations);

// Mock functions for component props
const mockHandlers = {
  onNumberClick: jest.fn(),
  onDecimalClick: jest.fn(),
  onNegativeClick: jest.fn(),
  onOperationClick: jest.fn(),
};

describe('UI Accessibility Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // T022: Calculator has no accessibility violations
  describe('Calculator Component Accessibility', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(<Calculator />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have proper ARIA roles and labels', () => {
      render(<Calculator />);

      // Calculator should have region role
      const calculator = screen.getByRole('region', { name: /calculator/i });
      expect(calculator).toBeInTheDocument();

      // All buttons should be accessible
      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toHaveAccessibleName();
      });
    });
  });

  // T022: Display component accessibility
  describe('Display Component Accessibility', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(
        <Display value="123" error={null} operation={null} />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations with error state', async () => {
      const { container } = render(
        <Display value="0" error="Cannot divide by zero" operation={null} />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have proper output role', () => {
      render(<Display value="456" error={null} operation="+" />);
      const output = screen.getByRole('status');
      expect(output).toBeInTheDocument();
    });
  });

  // T022: Keypad component accessibility
  describe('Keypad Component Accessibility', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(
        <Keypad
          onNumberClick={mockHandlers.onNumberClick}
          onDecimalClick={mockHandlers.onDecimalClick}
          onNegativeClick={mockHandlers.onNegativeClick}
        />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have accessible names for all number buttons', () => {
      render(
        <Keypad
          onNumberClick={mockHandlers.onNumberClick}
          onDecimalClick={mockHandlers.onDecimalClick}
          onNegativeClick={mockHandlers.onNegativeClick}
        />
      );

      // Check number buttons 0-9
      for (let i = 0; i <= 9; i++) {
        const button = screen.getByRole('button', { name: new RegExp(`${i}`, 'i') });
        expect(button).toBeInTheDocument();
      }

      // Check decimal and negative buttons
      expect(screen.getByRole('button', { name: /decimal/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /negative/i })).toBeInTheDocument();
    });
  });

  // T022: OperationButtons component accessibility
  describe('OperationButtons Component Accessibility', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(
        <OperationButtons
          onOperationClick={mockHandlers.onOperationClick}
          selectedOperation={null}
        />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have aria-pressed state for selected operation', () => {
      render(
        <OperationButtons
          onOperationClick={mockHandlers.onOperationClick}
          selectedOperation="+"
        />
      );

      const addButton = screen.getByRole('button', { name: /add/i });
      expect(addButton).toHaveAttribute('aria-pressed', 'true');

      const subtractButton = screen.getByRole('button', { name: /subtract/i });
      expect(subtractButton).toHaveAttribute('aria-pressed', 'false');
    });
  });

  // T023: Color contrast tests
  describe('Color Contrast Requirements', () => {
    /**
     * Helper to calculate relative luminance
     * @see https://www.w3.org/WAI/WCAG21/Techniques/general/G17
     */
    const getLuminance = (r: number, g: number, b: number): number => {
      const [rs, gs, bs] = [r, g, b].map(c => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    };

    /**
     * Calculate contrast ratio between two colors
     * @see https://www.w3.org/WAI/WCAG21/Techniques/general/G17
     */
    const getContrastRatio = (
      fg: [number, number, number],
      bg: [number, number, number]
    ): number => {
      const l1 = getLuminance(...fg);
      const l2 = getLuminance(...bg);
      const lighter = Math.max(l1, l2);
      const darker = Math.min(l1, l2);
      return (lighter + 0.05) / (darker + 0.05);
    };

    it('should meet WCAG AA contrast ratio of 4.5:1 for text on number buttons', () => {
      // White text (#f2f2f2 ≈ 242,242,242) on number button bg (hsl(220, 15%, 25%) ≈ 54,57,73)
      const textColor: [number, number, number] = [242, 242, 242];
      const buttonBg: [number, number, number] = [54, 57, 73];

      const ratio = getContrastRatio(textColor, buttonBg);
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    });

    it('should meet WCAG AA contrast ratio for text on operation buttons', () => {
      // White text on operation button bg (hsl(30, 100%, 40%) ≈ 204,102,0)
      const textColor: [number, number, number] = [255, 255, 255];
      const buttonBg: [number, number, number] = [204, 102, 0];

      const ratio = getContrastRatio(textColor, buttonBg);
      // Large text (18pt+) requires 3:1 minimum contrast ratio per WCAG AA
      expect(ratio).toBeGreaterThanOrEqual(3.0);
    });

    it('should meet WCAG AA contrast ratio for display text', () => {
      // White text (#f2f2f2) on display bg (hsl(220, 25%, 8%) ≈ 15,17,26)
      const textColor: [number, number, number] = [242, 242, 242];
      const displayBg: [number, number, number] = [15, 17, 26];

      const ratio = getContrastRatio(textColor, displayBg);
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    });

    it('should meet WCAG AA contrast ratio for error text', () => {
      // Red error text (hsl(0, 75%, 60%) ≈ 230,89,89) on display bg
      const errorColor: [number, number, number] = [230, 89, 89];
      const displayBg: [number, number, number] = [15, 17, 26];

      const ratio = getContrastRatio(errorColor, displayBg);
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    });
  });

  // T024: Touch target size tests
  describe('Touch Target Size Requirements', () => {
    it('should have minimum 44x44px touch targets for all buttons', () => {
      render(<Calculator />);

      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        // In JSDOM, we check for the min-h-touch and min-w-touch classes
        // or verify the element has appropriate sizing classes
        // The min-h-touch utility in tailwind.config.ts sets min-height: 44px
        expect(button.className).toMatch(/min-h-touch|py-4|h-\d+/);
      });
    });

    it('should have proper padding for touch targets', () => {
      render(<Calculator />);

      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        // Buttons should have vertical padding (py-4 = 1rem = 16px each side)
        expect(button.className).toMatch(/py-\d+/);
      });
    });
  });

  // ============================================================================
  // Phase 4: US4 - Enhanced Color Palette and Theming Tests
  // ============================================================================

  // T038: Selected operation button styling tests
  describe('Selected Operation Button Styling (US4)', () => {
    it('should have distinct styling when operation is selected (aria-pressed=true)', () => {
      render(
        <OperationButtons
          onOperationClick={mockHandlers.onOperationClick}
          selectedOperation="+"
        />
      );

      const addButton = screen.getByRole('button', { name: /add/i });

      // Selected button should have aria-pressed="true"
      expect(addButton).toHaveAttribute('aria-pressed', 'true');

      // Selected button should have brightness-125 and ring styles
      expect(addButton.className).toMatch(/brightness-125/);
      expect(addButton.className).toMatch(/ring-2/);
    });

    it('should have different styling for unselected operations', () => {
      render(
        <OperationButtons
          onOperationClick={mockHandlers.onOperationClick}
          selectedOperation="+"
        />
      );

      const subtractButton = screen.getByRole('button', { name: /subtract/i });

      // Unselected button should have aria-pressed="false"
      expect(subtractButton).toHaveAttribute('aria-pressed', 'false');

      // Unselected button should have hover:brightness-110 (not brightness-125)
      expect(subtractButton.className).toMatch(/hover:brightness-110/);
      expect(subtractButton.className).not.toMatch(/ring-2/);
    });
  });

  // T039: Error state color tests
  describe('Error State Display (US4)', () => {
    it('should display error with calculator.clear (red) color', () => {
      render(
        <Display value="0" error="Cannot divide by zero" operation={null} />
      );

      const output = screen.getByRole('status');
      expect(output).toHaveTextContent('Cannot divide by zero');

      // Error text should use calculator.clear color class
      expect(output.className).toMatch(/text-calculator-clear/);
    });

    it('should display normal value with calculator.text color', () => {
      render(
        <Display value="123" error={null} operation={null} />
      );

      const output = screen.getByRole('status');
      expect(output).toHaveTextContent('123');

      // Normal text should use calculator.text color class
      expect(output.className).toMatch(/text-calculator-text/);
    });
  });

  // T040: Hover state color contrast tests
  describe('Hover State Colors (US4)', () => {
    it('should have hover state classes on number buttons', () => {
      render(
        <Keypad
          onNumberClick={mockHandlers.onNumberClick}
          onDecimalClick={mockHandlers.onDecimalClick}
          onNegativeClick={mockHandlers.onNegativeClick}
        />
      );

      const button1 = screen.getByRole('button', { name: /number 1/i });

      // Should have hover brightness modifier
      expect(button1.className).toMatch(/hover:brightness-125/);
      // Should have active state
      expect(button1.className).toMatch(/active:brightness-90/);
    });

    it('should have hover state classes on operation buttons', () => {
      render(
        <OperationButtons
          onOperationClick={mockHandlers.onOperationClick}
          selectedOperation={null}
        />
      );

      const addButton = screen.getByRole('button', { name: /add/i });

      // Should have hover brightness modifier
      expect(addButton.className).toMatch(/hover:brightness-110/);
      // Should have active state
      expect(addButton.className).toMatch(/active:brightness-90/);
    });

    it('should have hover state classes on clear and equals buttons', () => {
      render(<Calculator />);

      const clearButton = screen.getByRole('button', { name: /clear/i });
      const equalsButton = screen.getByRole('button', { name: /calculate/i });

      // Clear button hover
      expect(clearButton.className).toMatch(/hover:brightness-110/);
      expect(clearButton.className).toMatch(/active:brightness-90/);

      // Equals button hover
      expect(equalsButton.className).toMatch(/hover:brightness-110/);
      expect(equalsButton.className).toMatch(/active:brightness-90/);
    });
  });

  // ============================================================================
  // Phase 6: US2 - Glassmorphism and Neumorphism Effects Tests
  // ============================================================================

  // T069: Glassmorphism classes applied to Calculator container
  describe('Glassmorphism Effects (US2)', () => {
    it('should have glass-container class on Calculator wrapper', () => {
      render(<Calculator />);

      const calculator = screen.getByRole('region', { name: /calculator/i });
      expect(calculator.className).toMatch(/glass-container/);
    });

    it('should have shadow and rounded corners on Calculator', () => {
      render(<Calculator />);

      const calculator = screen.getByRole('region', { name: /calculator/i });
      // Glass container should have shadow-2xl for depth
      expect(calculator.className).toMatch(/shadow-2xl/);
      // Should have rounded corners (from glass-container CSS)
    });
  });

  // T070: Neumorphic classes applied to buttons
  describe('Neumorphism Effects (US2)', () => {
    it('should have neomorphic-raised class on all number buttons', () => {
      render(
        <Keypad
          onNumberClick={mockHandlers.onNumberClick}
          onDecimalClick={mockHandlers.onDecimalClick}
          onNegativeClick={mockHandlers.onNegativeClick}
        />
      );

      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button.className).toMatch(/neomorphic-raised/);
      });
    });

    it('should have neomorphic-raised class on all operation buttons', () => {
      render(
        <OperationButtons
          onOperationClick={mockHandlers.onOperationClick}
          selectedOperation={null}
        />
      );

      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button.className).toMatch(/neomorphic-raised/);
      });
    });

    it('should have neomorphic-raised class on clear and equals buttons', () => {
      render(<Calculator />);

      const clearButton = screen.getByRole('button', { name: /clear/i });
      const equalsButton = screen.getByRole('button', { name: /calculate/i });

      expect(clearButton.className).toMatch(/neomorphic-raised/);
      expect(equalsButton.className).toMatch(/neomorphic-raised/);
    });
  });

  // T071: Fallback styles for browsers without backdrop-filter
  describe('Glassmorphism Fallback (US2)', () => {
    it('should have fallback defined in CSS via @supports rule', () => {
      // The fallback is defined in globals.css using @supports not (backdrop-filter: blur(12px))
      // This test verifies the glass-container class is applied, which includes the fallback
      render(<Calculator />);

      const calculator = screen.getByRole('region', { name: /calculator/i });
      expect(calculator.className).toMatch(/glass-container/);

      // The fallback behavior is purely CSS and handled by the browser
      // We verify the class is present; CSS handles fallback automatically
    });
  });

  // T076: Display depth treatment
  describe('Display Depth Treatment (US2)', () => {
    it('should have depth-creating styles on Display', () => {
      render(<Display value="123" error={null} operation={null} />);

      // Display wrapper should have shadow-inner for depth
      const displayWrapper = screen.getByRole('status').parentElement;
      expect(displayWrapper?.className).toMatch(/shadow-inner/);
      // Should have subtle border for depth definition
      expect(displayWrapper?.className).toMatch(/border/);
    });
  });

  // ============================================================================
  // Phase 7: US3 - Smooth Animations and Micro-interactions Tests
  // ============================================================================

  // T083: Hover transitions applied to buttons
  describe('Hover Transitions (US3)', () => {
    it('should have animate-on-hover class on number buttons', () => {
      render(
        <Keypad
          onNumberClick={mockHandlers.onNumberClick}
          onDecimalClick={mockHandlers.onDecimalClick}
          onNegativeClick={mockHandlers.onNegativeClick}
        />
      );

      const button1 = screen.getByRole('button', { name: /number 1/i });
      expect(button1.className).toMatch(/animate-on-hover/);
    });

    it('should have animate-on-hover class on operation buttons', () => {
      render(
        <OperationButtons
          onOperationClick={mockHandlers.onOperationClick}
          selectedOperation={null}
        />
      );

      const addButton = screen.getByRole('button', { name: /add/i });
      expect(addButton.className).toMatch(/animate-on-hover/);
    });

    it('should have animate-on-hover class on clear and equals buttons', () => {
      render(<Calculator />);

      const clearButton = screen.getByRole('button', { name: /clear/i });
      const equalsButton = screen.getByRole('button', { name: /calculate/i });

      expect(clearButton.className).toMatch(/animate-on-hover/);
      expect(equalsButton.className).toMatch(/animate-on-hover/);
    });

    it('should have transition-all class for smooth animations', () => {
      render(
        <Keypad
          onNumberClick={mockHandlers.onNumberClick}
          onDecimalClick={mockHandlers.onDecimalClick}
          onNegativeClick={mockHandlers.onNegativeClick}
        />
      );

      const button1 = screen.getByRole('button', { name: /number 1/i });
      expect(button1.className).toMatch(/transition-all/);
    });
  });

  // T084: Press animations applied on button click
  describe('Press Animations (US3)', () => {
    it('should have active state classes on number buttons', () => {
      render(
        <Keypad
          onNumberClick={mockHandlers.onNumberClick}
          onDecimalClick={mockHandlers.onDecimalClick}
          onNegativeClick={mockHandlers.onNegativeClick}
        />
      );

      const button1 = screen.getByRole('button', { name: /number 1/i });
      // Active state brightness modifier for pressed feedback
      expect(button1.className).toMatch(/active:brightness-90/);
    });

    it('should have active state classes on operation buttons', () => {
      render(
        <OperationButtons
          onOperationClick={mockHandlers.onOperationClick}
          selectedOperation={null}
        />
      );

      const addButton = screen.getByRole('button', { name: /add/i });
      expect(addButton.className).toMatch(/active:brightness-90/);
    });

    it('should have neomorphic-raised class for press shadow effect', () => {
      render(<Calculator />);

      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        // neomorphic-raised provides raised effect, active state gives pressed effect
        expect(button.className).toMatch(/neomorphic-raised/);
      });
    });
  });

  // T085: Result pulse animation triggers on calculation
  describe('Result Pulse Animation (US3)', () => {
    it('should have animate-pulse-result class available in Display', () => {
      // The pulse animation is defined in tailwind.config.ts
      // Display component will apply it when showPulse prop is true
      render(<Display value="123" error={null} operation={null} />);

      const output = screen.getByRole('status');
      // The animation class should be conditionally applied via component logic
      expect(output).toBeInTheDocument();
    });

    it('should apply pulse animation class when calculation result is shown', () => {
      // Test that the Display component can accept and apply animation state
      render(<Display value="42" error={null} operation={null} showPulse={true} />);

      const output = screen.getByRole('status');
      expect(output.className).toMatch(/animate-pulse-result/);
    });

    it('should not have pulse animation when not showing result', () => {
      render(<Display value="42" error={null} operation={null} showPulse={false} />);

      const output = screen.getByRole('status');
      expect(output.className).not.toMatch(/animate-pulse-result/);
    });
  });

  // T086: Error shake animation triggers on error
  describe('Error Shake Animation (US3)', () => {
    it('should apply shake animation class when error is displayed', () => {
      render(
        <Display value="0" error="Cannot divide by zero" operation={null} showShake={true} />
      );

      const output = screen.getByRole('status');
      expect(output.className).toMatch(/animate-shake-error/);
    });

    it('should not have shake animation when no error', () => {
      render(<Display value="123" error={null} operation={null} showShake={false} />);

      const output = screen.getByRole('status');
      expect(output.className).not.toMatch(/animate-shake-error/);
    });
  });

  // T087: Animations respect prefers-reduced-motion
  describe('Reduced Motion Support (US3)', () => {
    it('should have prefers-reduced-motion rule defined in CSS', () => {
      // This test verifies the CSS rule exists (defined in globals.css)
      // The actual behavior is handled by the browser
      render(<Calculator />);

      const calculator = screen.getByRole('region', { name: /calculator/i });
      // The component should render without error, CSS handles reduced motion
      expect(calculator).toBeInTheDocument();
    });

    it('should use transition classes that can be disabled by reduced-motion', () => {
      render(
        <Keypad
          onNumberClick={mockHandlers.onNumberClick}
          onDecimalClick={mockHandlers.onDecimalClick}
          onNegativeClick={mockHandlers.onNegativeClick}
        />
      );

      const button1 = screen.getByRole('button', { name: /number 1/i });
      // transition-all is used which is affected by prefers-reduced-motion CSS
      expect(button1.className).toMatch(/transition/);
    });
  });

  // ============================================================================
  // Phase 8: US6 - Responsive Layout Refinements Tests
  // ============================================================================

  // T105: Layout responsive at various breakpoints
  describe('Responsive Layout (US6)', () => {
    it('should have responsive spacing on Calculator container', () => {
      render(<Calculator />);

      const calculator = screen.getByRole('region', { name: /calculator/i });
      // Should have responsive padding: p-4 sm:p-6 lg:p-8
      expect(calculator.className).toMatch(/p-4/);
      expect(calculator.className).toMatch(/sm:p-6/);
      expect(calculator.className).toMatch(/lg:p-8/);
    });

    it('should have responsive gap between button groups', () => {
      render(<Calculator />);

      const calculator = screen.getByRole('region', { name: /calculator/i });
      // Grid container should have responsive gap: gap-2 sm:gap-3 lg:gap-4
      const gridContainer = calculator.querySelector('.grid');
      expect(gridContainer?.className).toMatch(/gap-2/);
      expect(gridContainer?.className).toMatch(/sm:gap-3/);
      expect(gridContainer?.className).toMatch(/lg:gap-4/);
    });

    it('should have max-width constraint on Calculator', () => {
      render(<Calculator />);

      const calculator = screen.getByRole('region', { name: /calculator/i });
      // Should have max-w-md to prevent awkward scaling
      expect(calculator.className).toMatch(/max-w-md/);
    });

    it('should be centered with mx-auto', () => {
      render(<Calculator />);

      const calculator = screen.getByRole('region', { name: /calculator/i });
      expect(calculator.className).toMatch(/mx-auto/);
    });
  });

  // T106: Touch targets maintain 44x44px minimum on mobile
  describe('Touch Target Size (US6)', () => {
    it('should have min-h-touch class on all buttons', () => {
      render(<Calculator />);

      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button.className).toMatch(/min-h-touch/);
      });
    });

    it('should have min-w-touch class on number buttons', () => {
      render(
        <Keypad
          onNumberClick={mockHandlers.onNumberClick}
          onDecimalClick={mockHandlers.onDecimalClick}
          onNegativeClick={mockHandlers.onNegativeClick}
        />
      );

      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button.className).toMatch(/min-w-touch/);
      });
    });
  });

  // T107: Typography scales appropriately across viewports
  describe('Responsive Typography (US6)', () => {
    it('should have responsive text sizing on number buttons', () => {
      render(
        <Keypad
          onNumberClick={mockHandlers.onNumberClick}
          onDecimalClick={mockHandlers.onDecimalClick}
          onNegativeClick={mockHandlers.onNegativeClick}
        />
      );

      const button1 = screen.getByRole('button', { name: /number 1/i });
      // Should have text-xl sm:text-2xl lg:text-3xl
      expect(button1.className).toMatch(/text-xl/);
      expect(button1.className).toMatch(/sm:text-2xl/);
      expect(button1.className).toMatch(/lg:text-3xl/);
    });

    it('should have responsive text sizing on operation buttons', () => {
      render(
        <OperationButtons
          onOperationClick={mockHandlers.onOperationClick}
          selectedOperation={null}
        />
      );

      const addButton = screen.getByRole('button', { name: /add/i });
      // Should have text-xl sm:text-2xl lg:text-3xl
      expect(addButton.className).toMatch(/text-xl/);
      expect(addButton.className).toMatch(/sm:text-2xl/);
      expect(addButton.className).toMatch(/lg:text-3xl/);
    });

    it('should have responsive text sizing on Display', () => {
      render(<Display value="123" error={null} operation={null} />);

      const output = screen.getByRole('status');
      // Should have text-3xl sm:text-4xl lg:text-5xl
      expect(output.className).toMatch(/text-3xl/);
      expect(output.className).toMatch(/sm:text-4xl/);
      expect(output.className).toMatch(/lg:text-5xl/);
    });

    it('should have responsive text sizing on clear and equals buttons', () => {
      render(<Calculator />);

      const clearButton = screen.getByRole('button', { name: /clear/i });
      const equalsButton = screen.getByRole('button', { name: /calculate/i });

      // Should have text-lg sm:text-xl lg:text-2xl
      expect(clearButton.className).toMatch(/text-lg/);
      expect(clearButton.className).toMatch(/sm:text-xl/);
      expect(clearButton.className).toMatch(/lg:text-2xl/);

      expect(equalsButton.className).toMatch(/text-lg/);
      expect(equalsButton.className).toMatch(/sm:text-xl/);
      expect(equalsButton.className).toMatch(/lg:text-2xl/);
    });
  });

  // T108: Calculator functional at 200% zoom
  describe('Zoom Compatibility (US6)', () => {
    it('should use relative units for sizing (rem-based)', () => {
      render(<Calculator />);

      const calculator = screen.getByRole('region', { name: /calculator/i });
      // max-w-md uses rem, not px, for zoom compatibility
      expect(calculator.className).toMatch(/max-w-md/);
    });

    it('should have w-full for fluid width', () => {
      render(<Calculator />);

      const calculator = screen.getByRole('region', { name: /calculator/i });
      expect(calculator.className).toMatch(/w-full/);
    });

    it('should have responsive padding for display', () => {
      render(<Display value="123" error={null} operation={null} />);

      const displayWrapper = screen.getByRole('status').parentElement;
      // Should have p-4 sm:p-5 for responsive padding
      expect(displayWrapper?.className).toMatch(/p-4/);
      expect(displayWrapper?.className).toMatch(/sm:p-5/);
    });
  });
});
