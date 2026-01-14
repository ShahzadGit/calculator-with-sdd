/**
 * Visual Regression Tests
 *
 * Snapshot tests for UI components to detect unintended visual changes.
 * Tests cover Calculator, Display, Keypad, and OperationButtons components.
 *
 * @see specs/002-ui-enhancements/spec.md for visual requirements
 */

import { render } from '@testing-library/react';
import Calculator from '@/components/Calculator';
import Display from '@/components/Display';
import Keypad from '@/components/Keypad';
import OperationButtons from '@/components/OperationButtons';

// Mock functions for component props
const mockHandlers = {
  onNumberClick: jest.fn(),
  onDecimalClick: jest.fn(),
  onNegativeClick: jest.fn(),
  onOperationClick: jest.fn(),
};

describe('Visual Regression Tests - Component Snapshots', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // T025: Calculator component snapshot
  describe('Calculator Component', () => {
    it('should match snapshot with default state', () => {
      const { container } = render(<Calculator />);
      expect(container.firstChild).toMatchSnapshot();
    });
  });

  // T025: Display component snapshots
  describe('Display Component', () => {
    it('should match snapshot with value only', () => {
      const { container } = render(
        <Display value="12345" error={null} operation={null} />
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should match snapshot with operation indicator', () => {
      const { container } = render(
        <Display value="100" error={null} operation="+" />
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should match snapshot with error state', () => {
      const { container } = render(
        <Display value="0" error="Cannot divide by zero" operation={null} />
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should match snapshot with large number', () => {
      const { container } = render(
        <Display value="9999999999" error={null} operation={null} />
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should match snapshot with decimal value', () => {
      const { container } = render(
        <Display value="3.14159" error={null} operation={null} />
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should match snapshot with negative value', () => {
      const { container } = render(
        <Display value="-42" error={null} operation={null} />
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });

  // T025: Keypad component snapshot
  describe('Keypad Component', () => {
    it('should match snapshot', () => {
      const { container } = render(
        <Keypad
          onNumberClick={mockHandlers.onNumberClick}
          onDecimalClick={mockHandlers.onDecimalClick}
          onNegativeClick={mockHandlers.onNegativeClick}
        />
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });

  // T025: OperationButtons component snapshots
  describe('OperationButtons Component', () => {
    it('should match snapshot with no selection', () => {
      const { container } = render(
        <OperationButtons
          onOperationClick={mockHandlers.onOperationClick}
          selectedOperation={null}
        />
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should match snapshot with add selected', () => {
      const { container } = render(
        <OperationButtons
          onOperationClick={mockHandlers.onOperationClick}
          selectedOperation="+"
        />
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should match snapshot with subtract selected', () => {
      const { container } = render(
        <OperationButtons
          onOperationClick={mockHandlers.onOperationClick}
          selectedOperation="-"
        />
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should match snapshot with multiply selected', () => {
      const { container } = render(
        <OperationButtons
          onOperationClick={mockHandlers.onOperationClick}
          selectedOperation="×"
        />
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should match snapshot with divide selected', () => {
      const { container } = render(
        <OperationButtons
          onOperationClick={mockHandlers.onOperationClick}
          selectedOperation="÷"
        />
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});
