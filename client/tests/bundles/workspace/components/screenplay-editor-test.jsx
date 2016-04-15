import React from "react";
import ReactDOM from "react-dom";
import ReactTestUtils from "react-addons-test-utils";
import { expect } from "chai";
import ScreenplayEditor from "bundles/workspace/components/screenplay-editor";

describe("ScreenplayEditor", () => {
  let server;

  beforeEach(() => { server = sinon.fakeServer.create(); });
  afterEach(() => { server.restore(); });

  describe("when 'New Section' button is clicked", () => {
    it("sends a POST to the provided 'sections_url', adds a new section to the" +
       " end of the sections array, and update currentSectionIndex to new member", () => {
      const component = ReactTestUtils.renderIntoDocument(
        <ScreenplayEditor
          sections={[{ url: "/screenplays/1/sections/1" }]}
          title={"My Screenplay"}
          url={"/screenplay/1"}
          sectionsUrl={"/screenplays/1/sections"} />
      );
      const componentElm = ReactDOM.findDOMNode(component);

      expect(component.state.sections.length).to.eql(1)

      ReactTestUtils.Simulate.click(componentElm.querySelector("a.create-section"));

      expect(server.requests[1].url).to.eql("/screenplays/1/sections");
      expect(server.requests[1].method).to.eql("POST");

      server.requests[1].respond(
        200,
        { "Content-Type": "application/json" },
        JSON.stringify({id: 2})
      );

      expect(component.state.sections.length).to.eql(2)
      expect(component.state.currentSectionIndex).to.eql(1)
    });
  });

  describe("when new section is selected from SectionList", () => {
    it("updates the current section index to the position of the selected", () => {
      const sections = [
        { title: "Screenplay 1", url: "/screenplays/1/sections/1" },
        { title: "Screenplay 2", url: "/screenplays/1/sections/2" }
      ];
      const component = ReactTestUtils.renderIntoDocument(
        <ScreenplayEditor
          sections={sections}
          title={"My Screenplay"}
          url={"/screenplay/1"}
          sectionsUrl={"/screenplays/1/sections"} />
      );

      expect(component.state.currentSectionIndex).to.eql(0)

      const componentElm = ReactDOM.findDOMNode(component);
      const sectionListItemElm = componentElm.querySelectorAll(".section-list-item")[1];
      ReactTestUtils.Simulate.click(sectionListItemElm);

      expect(component.state.currentSectionIndex).to.eql(1)
    });
  });

  describe("when currentSection position changes", () => {
    it("inserts the current section at the new index", () => {
      const sections = [
        { url: "/screenplays/1/sections/1" },
        { url: "/screenplays/1/sections/2" },
        { url: "/screenplays/1/sections/3" }
      ];
      const component = ReactTestUtils.renderIntoDocument(
        <ScreenplayEditor
          sections={sections}
          title={"My Screenplay"}
          url={"/screenplays/1"}
          sectionsUrl={"/screenplays/1/sections"} />
      );
      server.requests[0].respond(
        200,
        { "Content-Type": "application/json" },
        JSON.stringify({
          id:  1,
          notes: "The story begins",
          position: 0,
          title: "Introduction",
          url: "/screenplays/1/sections/1"
        })
      );
      const componentElm = ReactDOM.findDOMNode(component);
      const sectionPositionSelect = componentElm.querySelector(".section-position");
      sectionPositionSelect.value = "2";
      ReactTestUtils.Simulate.change(sectionPositionSelect);

      expect(component.state.sections).to.eql([
        { url: "/screenplays/1/sections/2" },
        { url: "/screenplays/1/sections/1" },
        { url: "/screenplays/1/sections/3" }
      ]);
    });
  });
  //TODO test title saving
});
