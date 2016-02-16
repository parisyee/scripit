import React, { PropTypes } from "react";
import $ from "jquery";
import _ from "lodash";

export default class SectionEditor extends React.Component {
  static propTypes = {
    onDelete: PropTypes.func.isRequired,
    onPositionChange: PropTypes.func.isRequired,
    onTitleChange: PropTypes.func.isRequired,
    totalSections: PropTypes.number.isRequired,
    url: PropTypes.string.isRequired
  };

  constructor(props, context) {
    super(props, context);

    this.AUTOSAVE_TIMER = null;
    this.state = { section: {} };

    _.bindAll(
      this,
      [
        "handleChange",
        "handlePositionChange",
        "handleTitleChange",
        "deleteSection"
      ]
    );
  };

  componentDidMount() {
    $.ajax({
      url: this.props.url,
      method: "GET",
      dataType: "json",
      success: ((data) => {
        this.setState({section: data});
      }).bind(this),
      error: ((xhr, status, error) => {
        console.log(error);
      })
    });
  };

  buildSection() {
    return {
      notes: this.state.section.notes,
      position: this.state.section.position,
      title: this.state.section.title
    };
  };

  handleChange() {
    this.setState((oldState) => {
      const section = oldState.section;
      section.title = this.refs.title.value;
      section.notes = this.refs.notes.value;

      return { section: section };
    }, () => {
      this.queueAutosave();
    });
  };

  handleTitleChange() {
    this.props.onTitleChange(this.refs.title.value);
    this.handleChange();
  };

  queueAutosave() {
    if (this.AUTOSAVE_TIMER) {
      clearTimeout(this.AUTOSAVE_TIMER);
    }

    $("#autosave-indicator").removeClass("saved").addClass("saving");

    this.AUTOSAVE_TIMER = setTimeout(function() {
      this.saveSection();
      this.AUTOSAVE_TIMER = null;
    }.bind(this), 1750);
  };

  saveSection(successCallback) {
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
  };

  deleteSection() {
    const isConfirmed = window.confirm(
      `Are you sure you want to delete ${this.state.section.title || 'Untitled'}?`
    );
    if (isConfirmed) {
      $.ajax({
        url: this.props.url,
        method: "DELETE",
        type: "json",
        success: ((data) => {
          this.props.onDelete();
        }).bind(this),
        error: ((xhr, status, error) => {
          console.log(error);
        })
      });
    }
  };

  handlePositionChange() {
    const position = parseInt(this.refs.position.value);
    this.props.onPositionChange(position);
    this.setState((oldState) => {
      const section = oldState.section;
      section.position = position;
      return { section: section };
    }, this.saveSection);
  };

  positionSelectNode() {
    const optionNodes = [...Array(this.props.totalSections).keys()].map((i) => {
      const index = i + 1;
      return (<option value={index}>{index}</option>);
    });

    return (
      <span className="uk-form">
        <select
          className="section-position"
          name="section[position]"
          ref="position"
          value={this.state.section.position}
          onChange={this.handlePositionChange}>
          {optionNodes}
        </select>
      </span>
    );
  };

  render() {
    return(
      <div className="section-editor uk-height-1-1">
        <div className="section-title-bar">
          <input
            className="uk-margin-left"
            name="section[title]"
            ref="title"
            placeholder="Untitled"
            onInput={this.handleTitleChange}
            value={this.state.section.title} />
          {this.positionSelectNode()}
          <a
            title="Delete section"
            className="delete-section uk-float-right uk-margin-right"
            href="javascript:void()"
            onClick={this.deleteSection}>
            <i className="uk-icon-trash"></i>
          </a>
        </div>
        <textarea
          placeholder="notes..."
          className="section-notes uk-margin-left"
          name="section[notes]"
          ref="notes"
          onInput={this.handleChange}
          value={this.state.section.notes}></textarea>
      </div>
    );
  }
}

