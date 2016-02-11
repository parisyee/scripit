import React, { PropTypes } from "react";
import $ from "jquery";
import _ from "lodash";
import Section from "./section";
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
        "deleteSection",
        "handleChange",
        "onSectionSelect",
        "onSectionTitleChange"
      ]
    );
  };

  screenplayTitle() {
    return (
      this.state.title || "Untitled"
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

    $("#autosave-indicator").html("Unsaved Changes");

    this.AUTOSAVE_TIMER = setTimeout(function() {
      this.saveScreenplay();
      this.AUTOSAVE_TIMER = null;
    }.bind(this), 1750);
  };

  saveScreenplay() {
    $("#autosave-indicator").html("Saving Changes...");

    $.ajax({
      url: this.props.url,
      method: "PUT",
      data: { screenplay: this.buildScreenplay() },
      dataType: "json",
      success: ((data) => {
        $("#autosave-indicator").html("Changes Saved");
      }).bind(this),
      error: (xhr, status, err) => {
        console.log(err);
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

  deleteSection() {
    $.ajax({
      url: this.currentSectionUrl(),
      method: "DELETE",
      type: "json",
      success: ((data) => {
        this.setState((oldState) => {
          let index = oldState.currentSectionIndex;
          const sections = oldState.sections;
          sections.splice(index, 1);
          if (index >= sections.length) {
            index = sections.length - 1;
          }
          return { sections: sections, currentSectionIndex: index };
        });
      }).bind(this),
      error: ((xhr, status, error) => {
        console.log(error);
      })
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

  render() {
    return (
      <div className="screenplay-editor">
        <div>
          <input
            className="uk-margin-left uk-width-7-10"
            defaultValue={this.screenplayTitle()}
            name="screenplay[title]"
            onChange={this.handleChange}
            ref="title" />
        </div>
        <div>
          <a
            className="create-section"
            href="javascript:void()"
            onClick={this.createSection}>
            New Section
          </a>
          <a
            className="delete-section"
            href="javascript:void()"
            onClick={this.deleteSection}>
            Delete Section
          </a>
        </div>
        <SectionList
          currentSectionIndex={this.state.currentSectionIndex}
          onSectionSelect={this.onSectionSelect}
          sections={this.state.sections} />
        <Section
          key={this.currentSectionUrl()}
          onTitleChange={this.onSectionTitleChange}
          url={this.currentSectionUrl()} />
      </div>
    );
  };
}
