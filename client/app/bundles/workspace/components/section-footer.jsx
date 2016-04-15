import React, { PropTypes } from "react";

export default React.createClass({
  propTypes: {
    onLeftArrowClick: PropTypes.func,
    onRightArrowClick: PropTypes.func,
    onVerticalRuleClick: PropTypes.func
  },

  renderToggleButtons: function() {
    return (
      <div className="uk-button-group">
        <a
          className="uk-button"
          onClick={this.props.onLeftArrowClick}
        >
          <i className="uk-icon uk-icon-angle-left"></i>
        </a>
        <a
          className="uk-button"
          onClick={this.props.onVerticalRuleClick}
        >
          |
        </a>
        <a
          className="uk-button"
          onClick={this.props.onRightArrowClick}
        >
          <i className="uk-icon uk-icon-angle-right"></i>
        </a>
      </div>
    );
  },

  render: function() {
    return (
      <nav className="section-footer uk-navbar">
        <ul className="uk-navbar-nav">
          <li>
            <a
              href="#section-list-modal"
              title="Create section"
              id="section-list-modal-toggle"
              className="uk-float-left uk-margin-left"
              data-uk-modal
            >
              <i className="uk-icon-list"></i>
            </a>
          </li>
        </ul>
        <div className="uk-navbar-flip">
          <ul className="uk-navbar-nav">
            <li>
              <span className="uk-navbar-content uk-text-large uk-margin-right">
                <i className="uk-icon-save saved" id="autosave-indicator"></i>
              </span>
            </li>
          </ul>
        </div>
        <div className="uk-navbar-content uk-navbar-center">
          {this.renderToggleButtons()}
        </div>
      </nav>
    );
  }
});
