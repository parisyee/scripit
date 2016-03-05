import React from "react";
import ReactDOM from "react-dom";
import ReactTestUtils from "react-addons-test-utils";
import { expect } from "chai";
import Uuid from "uuid-v4";
import ScreenplayElementList from "bundles/workspace/components/screenplay-element-list";

describe("ScreenplayElementList", () => {
  describe("componentDidMount", () => {
    let server;

    before(() => { server = sinon.fakeServer.create(); });
    after(() => { server.restore(); });

    it("fetches elements from the provided url", () => {
      const component = ReactTestUtils.renderIntoDocument(
        <ScreenplayElementList url={"/sections/1/elements"} />
      );

      expect(server.requests[0].method).to.eql("GET");
      expect(server.requests[0].url).to.eql("/sections/1/elements");

      const elementsJson = JSON.stringify([
        { type: "action", text: "NADINE signed onto her computer." }
      ]);
      server.requests[0].respond(
        200,
        { "Content-Type": "application/json" },
        JSON.stringify({ elements: elementsJson })
      );

      expect(component.state.elements.length).to.eql(1)
      expect(component.state.elements[0]).to.contain.keys(
        { type: "action", text: "NADINE signed onto her computer." }
      );
    });
  });

  describe("saveElementList", () => {
    let server;

    before(() => { server = sinon.fakeServer.create(); });
    after(() => { server.restore(); });

    it("sends a PUT request to the provided url with the current element list", () => {
      const component = ReactTestUtils.renderIntoDocument(
        <ScreenplayElementList url={"/sections/1/elements"} />
      );
      component.setState({
        elements: [
          { type: "heading", text: "INT. GARAGE - NIGHT" },
          { type: "action", text: "NADINE opens the car door." },
        ]
      });

      component.saveElementList();

      expect(server.requests[1].method).to.eql("PUT");
      expect(server.requests[1].url).to.eql("/sections/1/elements");
      expect(server.requests[1].requestBody).to.contain("GARAGE");
      expect(server.requests[1].requestBody).to.contain("NADINE");
    });

  });

  describe("queueAutosave", () => {
    it("sets a timer that calls saveElementList", (done) => {
      const component = ReactTestUtils.renderIntoDocument(
        <ScreenplayElementList url={"/sections/1/elements"} />
      );
      const saveElementList = sinon.spy(component, "saveElementList");

      component.queueAutosave();

      window.setTimeout(() => {
        expect(saveElementList).to.be.called;
        done();
      }, 1750);
    });
  });

  describe("onCurrentElementChange", () => {
    it("overwrites the currentElement with the one provided", () => {
      const component = ReactTestUtils.renderIntoDocument(
        <ScreenplayElementList url={"/section/1/elements"} />
      );
      component.handleCurrentElementChange({ type: "heading", text: "INT. HOUSE - DAY" });

      expect(getElementAttributes(component)).to.eql([["heading", "INT. HOUSE - DAY"]]);
    });

    it("calls queueAutosave", () => {
      const component = ReactTestUtils.renderIntoDocument(
        <ScreenplayElementList url={"/section/1/elements"} />
      );
      const queueAutosave = sinon.spy(component, "queueAutosave");
      component.handleCurrentElementChange({ type: "heading", text: "INT. HOUSE - DAY" });

      expect(queueAutosave).to.be.called;
    });
  });

  describe("removeCurrentElement", () => {
    describe("when currentElementIndex is not 0", () => {
      it("removes the current element and decrements the currentElementIndex by 1", () => {
        const component = ReactTestUtils.renderIntoDocument(
          <ScreenplayElementList url={"/section/1/elements"} />
        );
        component.setState({
          currentElementIndex: 1,
          elements: [
            { uuid: Uuid(), type: "heading", text: "INT. HOUSE - DAY" },
            { uuid: Uuid(), type: "action", text: "NADINE sits at the table." }
          ]
        });
        component.removeCurrentElement("");

        expect(component.state.currentElementIndex).to.eql(0);
        expect(getElementAttributes(component)).to.eql([["heading", "INT. HOUSE - DAY"]]);

        component.removeCurrentElement("");

        expect(component.state.currentElementIndex).to.eql(0);
        expect(getElementAttributes(component)).to.eql([["heading", "INT. HOUSE - DAY"]]);
      });

      it("calls appendNewTextToCurrent on the new current element with the provided text", () => {
        const component = ReactTestUtils.renderIntoDocument(
          <ScreenplayElementList url={"/section/1/elements"} />
        );
        component.setState({
          currentElementIndex: 1,
          elements: [
            { uuid: Uuid(), type: "heading", text: "INT. HOUSE - DAY" },
            { uuid: Uuid(), type: "action", text: "NADINE sits at the table." }
          ]
        });
        const nextCurrentElement = component.refs["screenplay-element-0"];
        const appendNewTextToCurrent = sinon.spy(nextCurrentElement, "appendNewTextToCurrent");
        component.removeCurrentElement("NADINE");

        expect(appendNewTextToCurrent).to.be.calledWith("NADINE");
      });

      it("calls queueAutosave", () => {
        const component = ReactTestUtils.renderIntoDocument(
          <ScreenplayElementList url={"/section/1/elements"} />
        );
        component.setState({
          currentElementIndex: 1,
          elements: [
            { uuid: Uuid(), type: "heading", text: "INT. HOUSE - DAY" },
            { uuid: Uuid(), type: "action", text: "NADINE sits at the table." }
          ]
        });
        const queueAutosave = sinon.spy(component, "queueAutosave");
        component.removeCurrentElement("");

        expect(queueAutosave).to.be.called;
      });
    });
  });

  describe("insertNewElementAfterCurrent", () => {
    it("adds a new element of the correct type at the index after the invoking element", () => {
      const component = ReactTestUtils.renderIntoDocument(
        <ScreenplayElementList url={"/section/1/elements"} />
      );
      const elements = [{ id: 1, type: "heading", text: "INT. HOUSE - DAY" }];

      component.setState({ currentElementIndex: 0, elements: elements });
      expect(getElementAttributes(component)).to.eql([["heading", "INT. HOUSE - DAY"]]);

      // heading => action
      component.insertElementAfterCurrent("");
      expect(getElementAttributes(component)).to.eql([
        ["heading", "INT. HOUSE - DAY"],
        ["action", ""]
      ]);

      // action => action
      elements[1].text = "JOE entered the room.";
      component.insertElementAfterCurrent("");
      expect(getElementAttributes(component)).to.eql([
        ["heading", "INT. HOUSE - DAY"],
        ["action", "JOE entered the room."],
        ["action", ""]
      ]);

      // character => dialogue
      elements[2].type = "character";
      elements[2].text = "JOE";
      component.insertElementAfterCurrent("");
      expect(getElementAttributes(component)).to.eql([
        ["heading", "INT. HOUSE - DAY"],
        ["action", "JOE entered the room."],
        ["character", "JOE"],
        ["dialogue", ""]
      ]);

      // dialogue => character
      elements[3].text = "Hello?";
      component.insertElementAfterCurrent("");
      expect(getElementAttributes(component)).to.eql([
        ["heading", "INT. HOUSE - DAY"],
        ["action", "JOE entered the room."],
        ["character", "JOE"],
        ["dialogue", "Hello?"],
        ["character", ""]
      ]);

      // parenthetical => dialogue
      elements[4].type = "parenthetical";
      elements[4].text = "under his breath";
      component.insertElementAfterCurrent("");
      expect(getElementAttributes(component)).to.eql([
        ["heading", "INT. HOUSE - DAY"],
        ["action", "JOE entered the room."],
        ["character", "JOE"],
        ["dialogue", "Hello?"],
        ["parenthetical", "under his breath"],
        ["dialogue", ""]
      ]);

      // transition => heading
      elements[5].type = "transition";
      elements[5].text = "CUT TO:";
      component.insertElementAfterCurrent("");
      expect(getElementAttributes(component)).to.eql([
        ["heading", "INT. HOUSE - DAY"],
        ["action", "JOE entered the room."],
        ["character", "JOE"],
        ["dialogue", "Hello?"],
        ["parenthetical", "under his breath"],
        ["transition", "CUT TO:"],
        ["heading", ""]
      ]);

      // when currentElementIndex is not the last position of elements array
      component.setState({ currentElementIndex: 0 });
      component.insertElementAfterCurrent("");
      expect(getElementAttributes(component)).to.eql([
        ["heading", "INT. HOUSE - DAY"],
        ["action", ""],
        ["action", "JOE entered the room."],
        ["character", "JOE"],
        ["dialogue", "Hello?"],
        ["parenthetical", "under his breath"],
        ["transition", "CUT TO:"],
        ["heading", ""]
      ]);

      component.setState({ currentElementIndex: 5 });
      component.insertElementAfterCurrent("");
      expect(getElementAttributes(component)).to.eql([
        ["heading", "INT. HOUSE - DAY"],
        ["action", ""],
        ["action", "JOE entered the room."],
        ["character", "JOE"],
        ["dialogue", "Hello?"],
        ["parenthetical", "under his breath"],
        ["dialogue", ""],
        ["transition", "CUT TO:"],
        ["heading", ""]
      ]);
    });

    it("changes focus to the new element", () => {
      const component = ReactDOM.render(
        <ScreenplayElementList url={"/section/1/elements"} />,
        document.getElementById("mocha-fixtures")
      );
      const elements = [{ id: 1, type: "heading", text: "INT. HOUSE - DAY" }];
      component.setState({ currentElementIndex: 0, elements: elements });
      const componentElm = ReactDOM.findDOMNode(component);
      let inputElm = componentElm.
        querySelector(".screenplay-element#heading-0").
        querySelector(".element-input");
      inputElm.focus();

      expect(document.activeElement).to.eql(inputElm)

      component.insertElementAfterCurrent("");
      inputElm = componentElm.
        querySelector(".screenplay-element#action-1").
        querySelector(".element-input");

      expect(document.activeElement).to.eql(inputElm)

      // cleanup component;
      ReactDOM.unmountComponentAtNode(document.getElementById("mocha-fixtures"));
    });

    it("adds the provided text to the newly inserted element", () => {
      const component = ReactTestUtils.renderIntoDocument(
        <ScreenplayElementList url={"/section/1/elements"} />
      );
      component.setState({
        currentElementIndex: 0,
        elements: [{ id: 1, type: "heading", text: "INT. HOUSE - DAY" }]
      });
      component.insertElementAfterCurrent("She opens the door.");

      expect(getElementAttributes(component)).to.eql([
        ["heading", "INT. HOUSE - DAY"],
        ["action", "She opens the door."]
      ]);
    });

    it("calls queueAutosave", () => {
      const component = ReactTestUtils.renderIntoDocument(
        <ScreenplayElementList url={"/section/1/elements"} />
      );
      component.setState({
        currentElementIndex: 0,
        elements: [{ id: 1, type: "heading", text: "INT. HOUSE - DAY" }]
      });
      const queueAutosave = sinon.spy(component, "queueAutosave");
      component.insertElementAfterCurrent("");

      expect(queueAutosave).to.be.called;
    });
  });

  function getElementAttributes(component) {
    return component.state.elements.map((e) => { return [e.type, e.text]; })
  };
});

