import React, { PropTypes } from "react";

export default React.createClass({
  propTypes: {
    onDelete: PropTypes.func.isRequired,
    onPositionChange: PropTypes.func.isRequired,
    onTitleChange: PropTypes.func.isRequired,
    position: PropTypes.number,
    title: PropTypes.string.isRequired,
    totalSections: PropTypes.number.isRequired
  },

  handleTitleChange: function() {
    this.props.onTitleChange(this.refs.title.value);
  },

  handlePositionChange: function() {
    this.props.onPositionChange(this.refs.position.value);
  },

  renderTitleInput: function() {
    return (
      <div className="uk-navbar-content">
        <input
          className="section-title-input uk-text-large uk-paddin-remove"
          name="section[title]"
          ref="title"
          placeholder="Untitled"
          onInput={this.handleTitleChange}
          value={this.props.title}
        />
      </div>
    );
  },

  renderPositionSelect: function() {
    const optionNodes = [...Array(this.props.totalSections).keys()].map((i) => {
      const index = i + 1;
      return (<option key={i} value={index}>{index}</option>);
    });

    return (
      <div className="uk-form uk-navbar-content">
        <select
          className="section-position"
          name="section[position]"
          ref="position"
          value={this.props.position}
          onChange={this.handlePositionChange}>
          {optionNodes}
        </select>
      </div>
    );
  },

  renderDeleteButton: function() {
    return (
      <a
        title="Delete section"
        className="delete-section"
        onClick={this.props.onDelete}>
        <i className="uk-icon-trash"></i>
      </a>
  );
  },

  render: function() {
    return (
      <nav className="section-header uk-navbar">
        <ul className="uk-navbar-nav">
          <li>
            {this.renderTitleInput()}
          </li>
        </ul>
        <div className="uk-navbar-flip">
          <ul className="uk-navbar-nav">
            <li>{this.renderPositionSelect()}</li>
            <li>{this.renderDeleteButton()}</li>
          </ul>
        </div>
      </nav>
    );
  }
});
