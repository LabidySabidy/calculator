import { useState, useEffect, useCallback } from 'react';
import './App.css';

const BUTTONS = [
  ['C', '⌫', '%', '÷'],
  ['7', '8', '9', '×'],
  ['4', '5', '6', '−'],
  ['1', '2', '3', '+'],
  ['0', '.', '='],
];

const OPERATORS = new Set(['+', '−', '×', '÷', '%']);

function calculate(expr) {
  const sanitized = expr
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/−/g, '-');

  try {
    const result = Function('"use strict"; return (' + sanitized + ')')();
    if (!isFinite(result)) return 'Error';
    const rounded = Math.round(result * 1e10) / 1e10;
    return String(rounded);
  } catch {
    return 'Error';
  }
}

export default function App() {
  const [display, setDisplay] = useState('0');
  const [evaluated, setEvaluated] = useState(false);

  const handleButton = useCallback((value) => {
    setDisplay((prev) => {
      if (prev === 'Error') prev = '0';

      if (value === 'C') return '0';

      if (value === '⌫') {
        return prev.length <= 1 || (prev.length === 2 && prev.startsWith('-'))
          ? '0'
          : prev.slice(0, -1);
      }

      if (value === '=') {
        const result = calculate(prev);
        setEvaluated(true);
        return result;
      }

      const lastChar = prev.slice(-1);
      const isOperator = OPERATORS.has(value);

      if (isOperator) {
        if (OPERATORS.has(lastChar)) {
          return prev.slice(0, -1) + value;
        }
        if (prev === '0' && value !== '%') return prev;
        setEvaluated(false);
        return prev + value;
      }

      if (value === '.') {
        const segments = prev.split(/[+\−×÷%]/);
        const lastSegment = segments[segments.length - 1];
        if (lastSegment.includes('.')) return prev;
        if (lastSegment === '') return prev + '0.';
      }

      if (evaluated) {
        setEvaluated(false);
        return value;
      }

      if (prev === '0') return value;

      return prev + value;
    });
  }, [evaluated]);

  useEffect(() => {
    const onKeyDown = (e) => {
      const keyMap = {
        '0': '0', '1': '1', '2': '2', '3': '3', '4': '4',
        '5': '5', '6': '6', '7': '7', '8': '8', '9': '9',
        '+': '+', '-': '−', '*': '×', '/': '÷', '%': '%',
        '.': '.', ',': '.',
        'Enter': '=', '=': '=',
        'Escape': 'C', 'c': 'C',
        'Backspace': '⌫',
      };

      const mapped = keyMap[e.key];
      if (mapped) {
        e.preventDefault();
        handleButton(mapped);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleButton]);

  return (
    <div className="calculator">
      <div className="display">{display}</div>
      <div className="buttons">
        {BUTTONS.flat().map((btn) => (
          <button
            key={btn}
            className={'btn' +
              (btn === '=' ? ' btn-equals' : '') +
              (btn === 'C' ? ' btn-clear' : '') +
              (OPERATORS.has(btn) ? ' btn-operator' : '') +
              (btn === '0' ? ' btn-zero' : '')
            }
            onClick={() => handleButton(btn)}
          >
            {btn}
          </button>
        ))}
      </div>
    </div>
  );
}
