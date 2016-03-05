import React, { PropTypes } from "react";
import $ from "jquery";
import _ from "lodash";
import ScreenplayElementList from "./screenplay-element-list";

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

  handleChange: function() {
    const title = this.refs.title.value;
    const notes = this.refs.notes.value;
    this.setState({
      notes: notes,
      title: title
    }, this.queueAutosave);
  },

  handlePositionChange: function() {
    const position = parseInt(this.refs.position.value);
    this.props.onPositionChange(position);
    this.setState({
      position: position
    }, this.saveSection);
  },

  handleTitleChange: function() {
    this.props.onTitleChange(this.refs.title.value);
    this.handleChange();
  },

  renderPositionSelect: function() {
    const optionNodes = [...Array(this.props.totalSections).keys()].map((i) => {
      const index = i + 1;
      return (<option key={i} value={index}>{index}</option>);
    });

    return (
      <span className="uk-form">
        <select
          className="section-position"
          name="section[position]"
          ref="position"
          value={this.state.position}
          onChange={this.handlePositionChange}>
          {optionNodes}
        </select>
      </span>
    );
  },

  renderTitleInput: function() {
    return (
      <input
        className="uk-margin-left"
        name="section[title]"
        ref="title"
        placeholder="Untitled"
        onInput={this.handleTitleChange}
        value={this.state.title} />
    );
  },

  renderDeleteButton: function() {
    return (
      <a
        title="Delete section"
        className="delete-section uk-float-right uk-margin-right"
        href="javascript:void()"
        onClick={this.deleteSection}>
        <i className="uk-icon-trash"></i>
      </a>
    );
  },

  renderScreenplayElementList: function() {
    if (this.state.elementListUrl) {
      return (
        <ScreenplayElementList url={this.state.elementListUrl} />
      );
    }
  },

  renderNotesTextarea: function() {
    return (
      <textarea
        placeholder="notes..."
        className="section-notes uk-margin-left"
        name="section[notes]"
        ref="notes"
        onInput={this.handleChange}
        value={this.state.notes}></textarea>
    );
  },

  render: function() {
    return(
      <div className="section-editor uk-grid uk-grid-collapse uk-height-1-1">
        <div className="section-title-bar uk-width-1-1">
          {this.renderTitleInput()}
          {this.renderPositionSelect()}
          {this.renderDeleteButton()}
        </div>
        <div className="uk-width-1-2">
          {this.renderScreenplayElementList()}
        </div>
        <div className="uk-width-1-2">
          {this.renderNotesTextarea()}
        </div>
      </div>
    );
  }
});

