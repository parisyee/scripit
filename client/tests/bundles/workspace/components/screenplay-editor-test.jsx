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
      const sectionListItemElm = componentElm.querySelectorAll("a.section-list-item")[1];
      ReactTestUtils.Simulate.click(sectionListItemElm);

      expect(component.state.currentSectionIndex).to.eql(1)
    });
  });

  describe("when delete section button is clicked", () => {
    it("sends a DELETE request to the currentSectionUrl and removes the section from the list", () => {
      const sections = [
        { title: "Screenplay 1", url: "/screenplays/1/sections/1" },
        { title: "Screenplay 2", url: "/screenplays/1/sections/2" },
        { title: "Screenplay 3", url: "/screenplays/1/sections/3" },
        { title: "Screenplay 4", url: "/screenplays/1/sections/4" },
        { title: "Screenplay 5", url: "/screenplays/1/sections/5" }
      ];
      const component = ReactTestUtils.renderIntoDocument(
        <ScreenplayEditor
          sections={sections}
          title={"My Screenplay"}
          url={"/screenplays/1"}
          sectionsUrl={"/screenplays/1/sections"} />
      );

      const componentElm = ReactDOM.findDOMNode(component);

      expect(
        componentElm.querySelector("a.section-list-item.active").innerHTML
      ).to.eql("Screenplay 1")

      const deleteSectionButton = componentElm.querySelector("a.delete-section");
      ReactTestUtils.Simulate.click(deleteSectionButton);

      expect(server.requests[1].method).to.eql("DELETE");
      expect(server.requests[1].url).to.eql("/screenplays/1/sections/1");

      server.requests[server.requests.length - 1].respond(200, { "Content-Type": "application/json" }, "{}");

      expect(
        componentElm.querySelector("a.section-list-item.active").innerHTML
      ).to.eql("Screenplay 2")
      expect(component.state.sections.length).to.eql(4)

      const lastSectionLink = componentElm.querySelectorAll("a.section-list-item")[3];
      ReactTestUtils.Simulate.click(lastSectionLink);
      ReactTestUtils.Simulate.click(deleteSectionButton);
      server.requests[server.requests.length - 1].respond(200, { "Content-Type": "application/json" }, "{}");

      expect(
        componentElm.querySelector("a.section-list-item.active").innerHTML
      ).to.eql("Screenplay 4")
      expect(component.state.sections.length).to.eql(3)

      const middleSectionLink = componentElm.querySelectorAll("a.section-list-item")[1];
      ReactTestUtils.Simulate.click(middleSectionLink);
      ReactTestUtils.Simulate.click(deleteSectionButton);
      server.requests[server.requests.length - 1].respond(200, { "Content-Type": "application/json" }, "{}");

      expect(
        componentElm.querySelector("a.section-list-item.active").innerHTML
      ).to.eql("Screenplay 4")
      expect(component.state.sections.length).to.eql(2)
    });
  });

  describe("when title changes", () => {
    it("queues the autosave timer and sends a PUT to the provided url", (done) => {
      const component = ReactTestUtils.renderIntoDocument(
        <ScreenplayEditor
          sections={[{ url: "/screenplays/1/sections/1" }]}
          title={"My Screenplay"}
          url={"/screenplays/1"}
          sectionsUrl={"/screenplays/1/sections"} />
      );
      const componentElm = ReactDOM.findDOMNode(component);
      const input = component.refs.title;

      expect(ReactDOM.findDOMNode(input).value).to.contain("My Screenplay")

      input.value = "New Screenplay";
      ReactTestUtils.Simulate.change(input);

      expect(
        document.getElementById("autosave-indicator").innerHTML
      ).to.contain("Unsaved Changes");

      window.setTimeout(() => {
        expect(
          document.getElementById("autosave-indicator").innerHTML
        ).to.contain("Saving Changes");

        expect(server.requests[1].method).to.eql("PUT");
        expect(server.requests[1].url).to.eql("/screenplays/1");

        server.requests[1].respond(200, { "Content-Type": "application/json" }, "{}");

        expect(
          document.getElementById("autosave-indicator").innerHTML
        ).to.contain("Changes Saved");

        done();
      }, 1750);
    });
  });
});
