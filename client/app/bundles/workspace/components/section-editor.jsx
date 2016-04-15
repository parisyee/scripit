import React, { PropTypes } from "react";
import $ from "jquery";
import classNames from "classnames";
import ScreenplayElementList from "./screenplay-element-list";
import SectionHeader from "./section-header";
import SectionFooter from "./section-footer";

export default React.createClass({
  propTypes: {
    onDelete: PropTypes.func.isRequired,
    onPositionChange: PropTypes.func.isRequired,
    onTitleChange: PropTypes.func.isRequired,
    totalSections: PropTypes.number.isRequired,
    url: PropTypes.string.isRequired
  },

  getInitialState: function() {
    return {
      elementListUrl: null,
      isDisplaying: "split",
      notes: "",
      position: null,
      title: ""
    };
  },

  componentDidMount: function() {
    $.ajax({
      url: this.props.url,
      method: "GET",
      dataType: "json",
      success: ((data) => {
        this.setState({
          elementListUrl: data.element_list_url,
          notes: data.notes,
          position: data.position,
          title: data.title
        });
      }).bind(this),
      error: ((xhr, status, error) => {
        console.log(error);
      })
    });
  },

  buildSection: function() {
    return {
      notes: this.state.notes,
      position: this.state.position,
      title: this.state.title
    };
  },

  saveSection: function(successCallback) {
    $.ajax({
      url: this.props.url,
      method: "PUT",
      data: { section: this.buildSection() },
      dataType: "json",
      beforeSend: ((xhr) => {
        xhr.setRequestHeader(
          'X-CSRF-Token',
          $('meta[name=csrf-token]').attr('content')
        );
      }),
      success: ((data) => {
        $("#autosave-indicator").removeClass("saving").addClass("saved");
        if (successCallback) { successCallback() }
      }).bind(this),
      error: (xhr, status, err) => {
        console.log(err);
        $("#autosave-indicator").removeClass("saving").addClass("error");
      }
    });
  },

  deleteSection: function() {
    const isConfirmed = window.confirm(
      `Are you sure you want to delete ${this.state.title || 'Untitled'}?`
    );
    if (isConfirmed) {
      this.props.onDelete();
      $.ajax({
        url: this.props.url,
        method: "DELETE",
        type: "json",
        success: (data) => {},
        error: (xhr, status, error) => {
          console.log(error);
        }
      });
    }
  },

  queueAutosave: function() {
    if (this.AUTOSAVE_TIMER) {
      clearTimeout(this.AUTOSAVE_TIMER);
    }
    $("#autosave-indicator").removeClass("saved").addClass("saving");
    this.AUTOSAVE_TIMER = setTimeout(function() {
      this.saveSection();
      this.AUTOSAVE_TIMER = null;
    }.bind(this), 1750);
  },

  handleNotesChange: function() {
    const notes = this.refs.notes.value;
    this.setState({
      notes: notes,
    }, this.queueAutosave);
  },

  handlePositionChange: function(newPosition) {
    const position = parseInt(newPosition);
    this.props.onPositionChange(position);
    this.setState({
      position: position
    }, this.saveSection);
  },

  handleTitleChange: function(newTitle) {
    this.props.onTitleChange(newTitle);
    this.setState({
      title: newTitle
    }, this.queueAutosave);
  },

  renderSectionHeader: function() {
    return (
      <SectionHeader
        onDelete={this.deleteSection}
        onPositionChange={this.handlePositionChange}
        onTitleChange={this.handleTitleChange}
        position={this.state.position}
        title={this.state.title}
        totalSections={this.props.totalSections}
      />
    );
  },

  screenplayElementListClasses: function() {
    return classNames(
      "screenplay-element-list-container",
      "uk-height-1-1",
      "uk-flex",
      "uk-flex-center",
      {
        "uk-hidden": (this.state.isDisplaying === "notes"),
        "uk-width-1-1": (this.state.isDisplaying === "elementList"),
        "uk-width-1-2": (this.state.isDisplaying === "split")
      }
    );
  },

  renderScreenplayElementList: function() {
    if (this.state.elementListUrl) {
      return (
        <div className={this.screenplayElementListClasses()}>
          <ScreenplayElementList url={this.state.elementListUrl} />
        </div>
      );
    }
  },

  notesTextareaClasses: function() {
    return classNames(
      "notes-textarea-container",
      "uk-height-1-1",
      "uk-flex",
      "uk-flex-center",
      {
        "uk-hidden": (this.state.isDisplaying === "elementList"),
        "uk-width-1-1": (this.state.isDisplaying === "notes"),
        "uk-width-1-2": (this.state.isDisplaying === "split")
      }
    );
  },

  renderNotesTextarea: function() {
    return (
      <div className={this.notesTextareaClasses()}>
        <textarea
          placeholder="notes..."
          className="section-notes uk-margin-right"
          name="section[notes]"
          ref="notes"
          onInput={this.handleNotesChange}
          value={this.state.notes}
        ></textarea>
      </div>
    );
  },

  renderSectionBody: function() {
    return (
      <div className="section-body uk-grid uk-grid-collapse">
        {this.renderScreenplayElementList()}
        {this.renderNotesTextarea()}
      </div>
    );
  },

  displayElementListOnly: function() {
    this.setState({ isDisplaying: "elementList" });
  },

  displayNotesOnly: function() {
    this.setState({ isDisplaying: "notes" });
  },

  displaySplit: function() {
    this.setState({ isDisplaying: "split" });
  },

  renderSectionFooter: function() {
    return (
      <SectionFooter
        onLeftArrowClick={this.displayNotesOnly}
        onRightArrowClick={this.displayElementListOnly}
        onVerticalRuleClick={this.displaySplit}
      />
    );
  },

  render: function() {
    return(
      <div className="section-editor uk-height-1-1">
        {this.renderSectionHeader()}
        {this.renderSectionBody()}
        {this.renderSectionFooter()}
      </div>
    );
  }
});
