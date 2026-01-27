/**
 * Code Editor Module
 * ==================
 * Exports all public components and utilities for the code editor.
 *
 * Public API
 * ----------
 * - CodeEditor: Main component for displaying the interactive editor
 * - Types: TypeScript types for language, tab names, etc.
 *
 * Internal Components (not exported)
 * ----------------------------------
 * These components are used internally by CodeEditor:
 * - EditorSidebar
 * - EditorTabBar
 * - CodeDisplay
 * - EditorStatusBar
 * - EditorOutputPanel
 *
 * They're not exported because:
 * 1. They depend on CodeEditor's state management
 * 2. Using them standalone would require duplicating state logic
 * 3. Keeps the public API simple
 *
 * If you need a standalone component (e.g., just CodeDisplay),
 * you can import it directly:
 *   import { CodeDisplay } from '@/components/code-editor/CodeDisplay';
 */

// Main component
export { CodeEditor } from './CodeEditor';

// Types for consumers who need to work with editor state
export type { Language, TabName, PanelTab } from './types';

// Utilities that might be useful elsewhere
export { highlightCode, stripComments, getFileExtension } from './syntax-highlighter';
