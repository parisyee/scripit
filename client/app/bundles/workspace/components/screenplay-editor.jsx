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
        }, this.closeModal);
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
    this.setState({
      currentSectionIndex: index
    }, this.closeModal);
  },

  closeModal: function() {
    UIkit.modal("#section-list-modal").hide();
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

  renderSectionEditor: function() {
    return (
      <div className="uk-width-1-1 uk-height-1-1">
        <SectionEditor
          key={this.currentSectionUrl()}
          onDelete={this.removeSection}
          onPositionChange={this.onSectionPositionChange}
          onTitleChange={this.onSectionTitleChange}
          totalSections={this.state.sections.length}
          url={this.currentSectionUrl()}
        />
      </div>
    );
  },

  renderSectionList: function() {
    return (
      <div className="uk-modal" id="section-list-modal">
        <div className="modal-content-container">
          <div className="screenplay-title-input-container uk-form">
            <input
              name="screenplay[title]"
              onInput={this.handleChange}
              ref="title"
              value={this.state.title}
            />
          </div>
          <div className="section-list-container">
            <SectionList
              currentSectionIndex={this.state.currentSectionIndex}
              onSectionSelect={this.onSectionSelect}
              sections={this.state.sections}
            />
          </div>
          <div className="create-section-button-container uk-margin-top">
            <a
              title="Create new section"
              className="create-section uk-button uk-width-1-1"
              onClick={this.createSection}
            >
              <i className="uk-icon-plus"></i>
            </a>
          </div>
        </div>
      </div>
    )
  },

  render: function() {
    return (
      <div className="screenplay-editor uk-grid uk-grid-collapse uk-height-1-1">
        {this.renderSectionList()}
        {this.renderSectionEditor()}
      </div>
    );
  }
})
