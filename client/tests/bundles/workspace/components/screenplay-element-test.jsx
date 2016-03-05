import React from "react";
import ReactDOM from "react-dom";
import ReactTestUtils from "react-addons-test-utils";
import { expect } from "chai";
import _ from "lodash";
import ScreenplayElement from "bundles/workspace/components/screenplay-element";

describe("ScreenplayElement", () => {
  describe("appendTextAfterCurrent", () => {
    it("appends the provided text to refs.text.value and calls handleTextChange", () => {
      const element = { type: "dialogue", text: "Sup dog?" };
      const onElementChange = sinon.spy();
      const component = ReactTestUtils.renderIntoDocument(
        <ScreenplayElement
          element={element}
          onElementChange={onElementChange} />
      );
      const handleTextChange = sinon.spy(component, "handleTextChange");

      component.appendNewTextToCurrent("How's it going?");

      expect(component.refs.text.value).to.eql("Sup dog?How's it going?");
      expect(handleTextChange).to.be.called;
    });

    it("places the cursor at the end of the pre-appended text", () => {
      const element = { type: "dialogue", text: "Sup dog?" };
      const onElementChange = sinon.spy();
      const onElementFocus = sinon.spy();
      const component = ReactDOM.render(
        <ScreenplayElement
          element={element}
          onElementChange={onElementChange}
          onElementFocus={onElementFocus} />,
        document.getElementById("mocha-fixtures")
      );
      const inputElm = ReactDOM.findDOMNode(component).querySelector(".element-input");

      component.appendNewTextToCurrent("How's it going?");

      expect(getCursorPosition(inputElm)).to.eql(8);
      // cleanup component
      ReactDOM.unmountComponentAtNode(document.getElementById("mocha-fixtures"));
    });
  });

  describe("handleTextChange", () => {
    it("updates the state with the value of refs.text.value", () => {
      const element = { type: "heading", text: "" };
      const onElementChange = sinon.spy();
      const component = ReactTestUtils.renderIntoDocument(
        <ScreenplayElement
          element={element}
          onElementChange={onElementChange} />
      );
      component.refs.text.value = "INT. HOUSE - DAY";
      component.handleTextChange();

      expect(component.state.text).to.eql("INT. HOUSE - DAY");
    });

    it("syncs the display input with refs.text.value if not already equal", () => {
      const element = { type: "heading", text: "" };
      const onElementChange = sinon.spy();
      const component = ReactTestUtils.renderIntoDocument(
        <ScreenplayElement
          element={element}
          onElementChange={onElementChange} />
      );
      component.refs.text.value = "INT. HOUSE - DAY";
      component.handleTextChange();

      const componentElm = ReactDOM.findDOMNode(component);
      const inputElm = componentElm.querySelector(".element-input");

      expect(inputElm).to.have.text("INT. HOUSE - DAY");
    });

    it("calls onElementChange with the current element state", () => {
      const element = { type: "heading", text: "", uuid: "uuid" };
      const onElementChange = sinon.spy();
      const component = ReactTestUtils.renderIntoDocument(
        <ScreenplayElement
          element={element}
          onElementChange={onElementChange} />
      );
      component.refs.text.value = "INT. HOUSE - DAY";
      component.handleTextChange();

      expect(onElementChange).to.be.calledWith({
        type: "heading",
        text: "INT. HOUSE - DAY",
        uuid: "uuid"
      });
    });

    it("calls the provided callback if any", () => {
      const onElementChange = sinon.spy();
      const component = ReactTestUtils.renderIntoDocument(
        <ScreenplayElement
          element={{}}
          onElementChange={onElementChange} />
      );
      const callback = sinon.spy();
      component.handleTextChange(callback);

      expect(callback).to.be.called;
    });
  });

  describe("handleInput", () => {
    it("updates refs.text.value with the value of the input and calls handleTextChange", () => {
      const element = { type: "heading", text: "" };
      const onElementChange = sinon.spy();
      const component = ReactTestUtils.renderIntoDocument(
        <ScreenplayElement
          element={element}
          onElementChange={onElementChange} />
      );
      const handleTextChange = sinon.spy(component, "handleTextChange");
      const input = component.refs.displayInput;
      input.textContent = "INT. HOUSE - DAY";
      const inputElm = ReactDOM.findDOMNode(input);
      ReactTestUtils.Simulate.input(inputElm);

      expect(component.refs.text.value).to.eql("INT. HOUSE - DAY");
      expect(handleTextChange).to.be.called;
    });
  });

  describe("ENTER key down", () => {
    describe("if the text is blank", () => {
      it("switches the element type", () => {
        const element = { type: "heading", text: "" };
        const onElementChange = sinon.spy();
        const component = ReactTestUtils.renderIntoDocument(
          <ScreenplayElement
          element={element}
          onElementChange={onElementChange} />
        );
        const componentElm = ReactDOM.findDOMNode(component);

        ReactTestUtils.Simulate.keyDown(componentElm, { key: "Enter", keyCode: 13, which: 13 });
        expect(component.state.type).to.eql("action");

        ReactTestUtils.Simulate.keyDown(componentElm, { key: "Enter", keyCode: 13, which: 13 });
        expect(component.state.type).to.eql("character");

        ReactTestUtils.Simulate.keyDown(componentElm, { key: "Enter", keyCode: 13, which: 13 });
        expect(component.state.type).to.eql("dialogue");

        ReactTestUtils.Simulate.keyDown(componentElm, { key: "Enter", keyCode: 13, which: 13 });
        expect(component.state.type).to.eql("parenthetical");

        ReactTestUtils.Simulate.keyDown(componentElm, { key: "Enter", keyCode: 13, which: 13 });
        expect(component.state.type).to.eql("transition");

        ReactTestUtils.Simulate.keyDown(componentElm, { key: "Enter", keyCode: 13, which: 13 });
        expect(component.state.type).to.eql("heading");
      });

      it("calls the onElementChange callback with the element", () => {
        const element = { type: "heading", text: "", uuid: "uuid" };
        const onElementChange = sinon.spy();
        const component = ReactTestUtils.renderIntoDocument(
          <ScreenplayElement
          element={element}
          onElementChange={onElementChange} />
        );
        const componentElm = ReactDOM.findDOMNode(component);

        ReactTestUtils.Simulate.keyDown(componentElm, { key: "Enter", keyCode: 13, which: 13 });

        expect(onElementChange).to.be.calledWith({ type: "action", text: "", uuid: "uuid" });
      });
    });

    describe("if the text is not blank", () => {
      it("removes all text from the current element that is after the cursor", () => {
        const element = { type: "action", text: "She opened the door. She walked through." };
        const onElementChange = sinon.spy();
        const onElementFocus = sinon.spy();
        const triggerElementInsert = sinon.spy();
        const component = ReactDOM.render(
          <ScreenplayElement
            element={element}
            onElementChange={onElementChange}
            onElementFocus={onElementFocus}
            triggerElementInsert={triggerElementInsert} />,
          document.getElementById("mocha-fixtures")
        );
        const componentElm = ReactDOM.findDOMNode(component);
        const inputElm = componentElm.querySelector(".element-input");
        positionCursor(inputElm, 21);

        ReactTestUtils.Simulate.keyDown(componentElm, { key: "Enter", keyCode: 13, which: 13 });

        expect(component.state.text).to.eql("She opened the door. ");

        // cleanup component
        ReactDOM.unmountComponentAtNode(document.getElementById("mocha-fixtures"));
      });

      it("calls handleTextChange and calls triggerElementInsert with the popped text", () => {
        const element = { type: "action", text: "She opened the door. She walked through." };
        const onElementChange = sinon.spy();
        const onElementFocus = sinon.spy();
        const triggerElementInsert = sinon.spy();
        const component = ReactDOM.render(
          <ScreenplayElement
            element={element}
            onElementChange={onElementChange}
            onElementFocus={onElementFocus}
            triggerElementInsert={triggerElementInsert} />,
          document.getElementById("mocha-fixtures")
        );
        const handleTextChange = sinon.spy(component, "handleTextChange");
        const componentElm = ReactDOM.findDOMNode(component);
        const inputElm = componentElm.querySelector(".element-input");
        positionCursor(inputElm, 21);

        ReactTestUtils.Simulate.keyDown(componentElm, { key: "Enter", keyCode: 13, which: 13 });

        expect(handleTextChange).to.be.called;
        expect(triggerElementInsert).to.be.calledWith("She walked through.");

        // cleanup component
        ReactDOM.unmountComponentAtNode(document.getElementById("mocha-fixtures"));
      });
    });
  });

  describe("BACKSPACE key down", () => {
    describe("when there is no text before the cursor", () => {
      it("called the triggerElementRemove callback with the element text", () => {
        const element = { type: "heading", text: "" };
        const triggerElementRemove = sinon.spy();
        const component = ReactTestUtils.renderIntoDocument(
          <ScreenplayElement
            element={element}
            triggerElementRemove={triggerElementRemove} />
        );
        const componentElm = ReactDOM.findDOMNode(component);

        ReactTestUtils.Simulate.keyDown(componentElm, { key: "Backspace", keyCode: 8, which: 8 });

        expect(triggerElementRemove).to.be.calledWith("");
      });
    });
  });

  describe("TAB key down", () => {
    it("switches the element type and calls the onElementChange callback", () => {
      const element = { type: "heading", text: "int. house - day", uuid: "uuid" };
      const onElementChange = sinon.spy();
      const component = ReactTestUtils.renderIntoDocument(
        <ScreenplayElement
        element={element}
        onElementChange={onElementChange} />
      );
      const componentElm = ReactDOM.findDOMNode(component);

      ReactTestUtils.Simulate.keyDown(componentElm, { key: "Tab", keyCode: 9, which: 9 });

      expect(component.state.type).to.eql("action");
      expect(onElementChange).to.be.calledWith({
        type: "action",
        text: "int. house - day",
        uuid: "uuid"
      });
    });
  });

  function positionCursor(el, position) {
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
  }

  function getCursorPosition(el) {
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
  }
});
