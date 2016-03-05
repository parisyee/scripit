import React, { PropTypes } from "react";
import $ from "jquery";
import _ from "lodash";
import SectionEditor from "./section-editor";
import SectionList from "./section-list";

export default React.createClass({
  propTypes: {
    title: PropTypes.string.isRequired,
    sections: PropTypes.array.isRequired,
    url: PropTypes.string.isRequired,
    sectionsUrl: PropTypes.string.isRequired
  },

  getInitialState: function() {
    return {
      title: this.props.title,
      sections: this.props.sections,
      sectionsUrl: this.props.sectionsUrl,
      url: this.props.url,
      currentSectionIndex: 0
    };
  },

  buildScreenplay: function() {
    return { title: this.state.title };
  },

  handleChange: function() {
    this.setState({ title: this.refs.title.value }, this.queueAutosave);
  },

  queueAutosave: function() {
    if (this.AUTOSAVE_TIMER) {
      clearTimeout(this.AUTOSAVE_TIMER);
    }

    $("#autosave-indicator").removeClass("saved").addClass("saving");

    this.AUTOSAVE_TIMER = setTimeout(function() {
      this.saveScreenplay();
      this.AUTOSAVE_TIMER = null;
    }.bind(this), 1750);
  },

  saveScreenplay: function() {
    $.ajax({
      url: this.props.url,
      method: "PUT",
      data: { screenplay: this.buildScreenplay() },
      dataType: "json",
      success: ((data) => {
        $("#autosave-indicator").removeClass("saving").addClass("saved");
      }).bind(this),
      error: (xhr, status, err) => {
        console.log(err);
        $("#autosave-indicator").removeClass("saving").addClass("error");
      }
    });
  },

  createSection: function() {
    $.ajax({
      url: this.props.sectionsUrl,
      method: "POST",
      data: {},
      type: "json",
      success: ((data) => {
        this.setState((oldState) => {
          const sections = oldState.sections;
          sections.push(data);
          const index = sections.length - 1;

          return {
            sections: sections,
            currentSectionIndex: index
          };
        });
      }).bind(this),
      error: ((xhr, status, error) => {
        console.log(error);
      })
    });
  },

  removeSection: function() {
    this.setState((oldState) => {
      let index = oldState.currentSectionIndex;
      const sections = oldState.sections;
      sections.splice(index, 1);
      if (index >= sections.length) {
        index = sections.length - 1;
      }
      return { sections: sections, currentSectionIndex: index };
    });
  },

  onSectionSelect: function(index) {
    this.setState({ currentSectionIndex: index });
  },

  onSectionPositionChange: function(newPosition) {
    const newIndex = newPosition - 1;
    this.setState((oldState) => {
      const sections = oldState.sections;
      const currentSection = sections.splice(oldState.currentSectionIndex, 1)[0];
      sections.splice(newIndex, 0, currentSection);

      return { sections: sections, currentSectionIndex: newIndex };
    });
  },

  onSectionTitleChange: function(title) {
    this.setState((oldState) => {
      const sections = oldState.sections;
      sections[this.state.currentSectionIndex].title = title;
      return { sections: sections };
    });
  },

  currentSectionUrl: function() {
    return (
      this.state.sections[this.state.currentSectionIndex].url
    );
  },

  sectionEditorNode: function() {
    if (this.state.sections.length > 0) {
      return (
        <SectionEditor
          key={this.currentSectionUrl()}
          onDelete={this.removeSection}
          onPositionChange={this.onSectionPositionChange}
          onTitleChange={this.onSectionTitleChange}
          totalSections={this.state.sections.length}
          url={this.currentSectionUrl()} />
      );
    } else {
      return "Add a section";
    }
  },

  render: function() {
    return (
      <div className="screenplay-editor uk-grid uk-grid-collapse uk-height-1-1">
        <div className="sidebar uk-height-1-1 uk-width-1-5">
          <div className="screenplay-title">
            <input
              className=""
              placeholder="Untitled"
              value={this.state.title}
              name="screenplay[title]"
              onChange={this.handleChange}
              ref="title" />
          </div>
          <SectionList
            currentSectionIndex={this.state.currentSectionIndex}
            onSectionSelect={this.onSectionSelect}
            sections={this.state.sections} />
          <div className="control-panel uk-grid uk-grid-collapse">
            <a
              title="Back to screenplays"
              className="uk-width-1-4 uk-text-center"
              href="/screenplays">
              <i className="uk-icon-arrow-left"></i>
            </a>
            <span className="uk-width-2-4 uk-text-center">
              <i className="uk-icon-save saved" id="autosave-indicator"></i>
            </span>
            <a
              title="Create new section"
              className="create-section uk-width-1-4 uk-text-center"
              href="javascript:void()"
              onClick={this.createSection}>
              <i className="uk-icon-plus"></i>
            </a>
          </div>
        </div>
        <div className="uk-width-4-5">
          {this.sectionEditorNode()}
        </div>
      </div>
    );
  }
})
