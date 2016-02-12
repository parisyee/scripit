import React, { PropTypes } from "react";
import $ from "jquery";
import _ from "lodash";
import SectionEditor from "./section-editor";
import SectionList from "./section-list";

export default class ScreenplayEditor extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    sections: PropTypes.array.isRequired,
    url: PropTypes.string.isRequired,
    sectionsUrl: PropTypes.string.isRequired
  };

  constructor(props, context) {
    super(props, context);

    this.AUTOSAVE_TIMER = null;
    this.state = {
      title: this.props.title,
      sections: this.props.sections,
      sectionsUrl: this.props.sectionsUrl,
      url: this.props.url,
      currentSectionIndex: 0
    };

    _.bindAll(
      this,
      [
        "createSection",
        "removeSection",
        "handleChange",
        "onSectionSelect",
        "onSectionTitleChange"
      ]
    );
  };

  buildScreenplay() {
    return { title: this.state.title };
  };

  handleChange() {
    this.setState({ title: this.refs.title.value }, this.queueAutosave);
  };

  queueAutosave() {
    if (this.AUTOSAVE_TIMER) {
      clearTimeout(this.AUTOSAVE_TIMER);
    }

    $("#autosave-indicator").removeClass("saved").addClass("saving");

    this.AUTOSAVE_TIMER = setTimeout(function() {
      this.saveScreenplay();
      this.AUTOSAVE_TIMER = null;
    }.bind(this), 1750);
  };

  saveScreenplay() {
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
  };

  createSection() {
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
  };

  removeSection() {
    this.setState((oldState) => {
      let index = oldState.currentSectionIndex;
      const sections = oldState.sections;
      sections.splice(index, 1);
      if (index >= sections.length) {
        index = sections.length - 1;
      }
      return { sections: sections, currentSectionIndex: index };
    });
  };

  onSectionSelect(index) {
    this.setState({ currentSectionIndex: index });
  };

  onSectionTitleChange(title) {
    this.setState((oldState) => {
      const sections = oldState.sections;
      sections[this.state.currentSectionIndex].title = title;
      return { sections: sections };
    });
  };

  currentSectionUrl() {
    return (
      this.state.sections[this.state.currentSectionIndex].url
    );
  };

  sectionEditorNode() {
    if (this.state.sections.length > 0) {
      return (
        <SectionEditor
          key={this.currentSectionUrl()}
          onDelete={this.removeSection}
          onTitleChange={this.onSectionTitleChange}
          url={this.currentSectionUrl()} />
      );
    } else {
      return "Add a section";
    }
  };

  render() {
    return (
      <div className="screenplay-editor uk-grid uk-grid-collapse uk-height-1-1">
        <div className="sidebar uk-height-1-1">
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
        {this.sectionEditorNode()}
      </div>
    );
  };
}
