import React, { PropTypes } from "react";
import classNames from "classnames";
import $ from "jquery";

export default React.createClass({
  KEYCODES: {
    backspace: 8,
    enter: 13,
    tab: 9,
  },

  NEXT_ELEMENT_TYPE_SEQUENCE: {
    "heading": "action",
    "action": "character",
    "character": "dialogue",
    "dialogue": "parenthetical",
    "parenthetical": "transition",
    "transition": "heading"
  },

  propTypes: {
    element: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    onElementChange: PropTypes.func.isRequired,
    onElementFocus: PropTypes.func.isRequired,
    triggerElementInsert: PropTypes.func.isRequired,
    triggerElementRemove: PropTypes.func.isRequired
  },

  getInitialState: function() {
    return {
      text: this.props.element.text,
      type: this.props.element.type
    };
  },

  componentDidMount: function() {
    this.syncDisplayInput();
  },

  syncDisplayInput: function() {
    if (this.refs.displayInput.textContent !== this.state.text) {
      this.refs.displayInput.textContent = this.state.text;
    }
  },

  elementClasses: function() {
    return classNames(
      "screenplay-element",
      this.state.type,
      {"uk-text-right": (this.state.type == "transition")}
    );
  },

  elementId: function() {
    return `${this.state.type}-${this.props.index}`;
  },

  buildElement: function() {
    return {
      type: this.state.type,
      text: this.state.text,
      uuid: this.props.element.uuid
    };
  },

  handleTextChange: function(callback) {
    this.setState({ text: this.refs.text.value }, () => {
      this.syncDisplayInput();
      this.props.onElementChange(this.buildElement())
      if (callback && typeof callback === "function") { callback(); }
    });
  },

  handleInput: function() {
    this.refs.text.value = this.refs.displayInput.textContent;
    this.handleTextChange();
  },

  handleEnterKeyDown: function(event) {
    event.preventDefault();
    if (this.state.text) {
      const newText = this.popTextAfterCursor();
      this.handleTextChange(() => {
        this.props.triggerElementInsert(newText);
      });
    } else {
      this.switchElementType();
    }
  },

  popTextAfterCursor: function() {
    const position = this.getCursorPosition();
    const afterText = this.refs.text.value.substr(position);
    const beforeText = this.refs.text.value.substr(0, position);
    this.refs.text.value = beforeText;
    return afterText;
  },

  getCursorPosition: function() {
    const el = this.refs.displayInput;
    let caretPos = 0;
    let sel;
    let range;

    if (window.getSelection) {
      sel = window.getSelection();
      if (sel.rangeCount) {
        range = sel.getRangeAt(0);
        if (range.commonAncestorContainer.parentNode == el) {
          caretPos = range.endOffset;
        }
      }
    } else if (document.selection && document.selection.createRange) {
      range = document.selection.createRange();
      if (range.parentElement() == el) {
        const tempEl = document.createElement("span");
        el.insertBefore(tempEl, el.firstChild);
        const tempRange = range.duplicate();
        tempRange.moveToElementText(tempEl);
        tempRange.setEndPoint("EndToEnd", range);
        caretPos = tempRange.text.length;
      }
    }
    return caretPos;
  },

  appendNewTextToCurrent: function(newText) {
    const text = this.refs.text.value;
    const cursorPosition = text.length;
    this.refs.text.value = text + newText;
    this.handleTextChange(() => {
      this.placeCursorAt(cursorPosition);
    });
  },

  placeCursorAt: function(position) {
    const el = this.refs.displayInput;
    el.focus();
    if (typeof window.getSelection != "undefined"
        && typeof document.createRange != "undefined") {
          const range = document.createRange();
          const sel = window.getSelection();
          const textNode = el.firstChild;
          range.selectNodeContents(el);
          range.setStart(textNode, position);
          range.collapse(true)
          sel.removeAllRanges();
          sel.addRange(range);
        } else if (typeof document.body.createTextRange != "undefined") {
          const textRange = document.body.createTextRange();
          textRange.moveToElementText(el);
          textRange.moveEnd("character", position);
          textRange.moveStart("character", position);
          textRange.select();
        }
  },

  handleBackspaceKeyDown: function(event) {
    if (this.getCursorPosition() === 0) {
      event.preventDefault();
      this.props.triggerElementRemove(this.state.text);
    }
  },

  handleTabKeyDown: function(event) {
    event.preventDefault();
    this.switchElementType();
  },

  handleKeyDown: function(event) {
    if(event.keyCode == this.KEYCODES.enter) {
      this.handleEnterKeyDown(event);
    }
    if(event.keyCode == this.KEYCODES.backspace) {
      this.handleBackspaceKeyDown(event);
    }
    if(event.keyCode == this.KEYCODES.tab) {
      this.handleTabKeyDown(event);
    }
  },

  switchElementType: function() {
    const newType = this.NEXT_ELEMENT_TYPE_SEQUENCE[this.state.type];
    this.setState({ type: newType }, () => {
      this.props.onElementChange(this.buildElement());
    });
  },

  handleFocus: function() {
    this.props.onElementFocus(this.props.index);
  },

  render: function() {
    return (
      <div
        className={this.elementClasses()}
        id={this.elementId()}
        onFocus={this.handleFocus}
        onKeyDown={this.handleKeyDown}
      >
        <div
          className="element-input"
          contentEditable="true"
          onInput={this.handleInput}
          ref="displayInput"
        ></div>
        <textarea
          className="uk-hidden"
          defaultValue={this.state.text}
          onChange={this.handleTextChange}
          ref="text"
        ></textarea>
      </div>
    );
  }
})

